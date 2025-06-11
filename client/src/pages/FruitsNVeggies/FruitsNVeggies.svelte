<script>
    import FoodBox from "../../components/FoodBox.svelte";
    import { onMount } from "svelte";
    import { authStore } from "../../stores/authStore.js";
    import { fetchGet, fetchPost } from "../../utils/fetch.js";
    import { io } from "socket.io-client";
    import { get } from "svelte/store";
    import SearchFruitsNVeggies from "../../components/SearchFruitsNVeggies.svelte";
    import ShowFoodModal from "../../components/ShowFoodModal.svelte";

    const socket = io("http://localhost:8080", {
        withCredentials: true
    });

    let selectedFood = null;

    let currentWeekId = null;

    let query = "";

    let fruits = [];
    let veggies = [];

    let filteredFruits = [];
    let filteredVeggies = [];


    let selectedFruitIds = [];
    let selectedVeggieIds = [];

    let isSaving = false;
    let saveMessage = ""; //virkelig denne?? måske ikke
    let saveError = ""; // og denne behøves måske heller ikke. og eller error som den adnen

    onMount(async () => {
        console.log("Fruits N Veggies route Mountet");

        const auth = get(authStore);
        if (!auth || !auth.isLoggedIn) {
            console.log("AuthStore is not ready");
            return;
        }


        const weekResult = await fetchGet('/api/protected/current-week');
        if (!weekResult.error && weekResult.weekId) {
            currentWeekId = weekResult.weekId;
        } else {
            console.log("Kunne ikke hente current week fra server");
            return;
        }
        await Promise.all([loadFruits(), loadVeggies(), loadUserSelections()]);
    });

    async function loadFruits() {
        const fruitData = await fetchGet('/api/protected/fruits');
        if (!fruitData.error) {
            fruits = fruitData.data;
        }
    }

    async function loadVeggies() {
        const veggieData = await fetchGet('/api/protected/vegetables');
        if (!veggieData.error) {
            veggies = veggieData.data;
        }
    }

    async function loadUserSelections() {
        try {
            const selections = await fetchGet(`/api/protected/user-selections?week_id=${currentWeekId}`);

            if (!selections.error && selections.success) {
                selectedFruitIds = selections.data.fruits.map(fruit => fruit.id);
                selectedVeggieIds = selections.data.vegetables.map(veg => veg.id);
            }
        } catch (error) {
            console.log("Couln't read the users earlier choices:", error);
            
        }
        
    }

    function toggleFruit(fruit) {
        if (selectedFruitIds.includes(fruit.id)) {
            selectedFruitIds = selectedFruitIds.filter(id => id !== fruit.id);
        } else {
            selectedFruitIds = [...selectedFruitIds, fruit.id];
        }
        console.log("Selected fruits:", selectedFruitIds);
    }

    function toggleVeggie(veggie) {
        if (selectedVeggieIds.includes(veggie.id)) {
            selectedVeggieIds = selectedVeggieIds.filter(id => id !== veggie.id);
        } else {
            selectedVeggieIds = [...selectedVeggieIds, veggie.id];
        }
        console.log("Selected veggies:", selectedVeggieIds);
    }

    async function saveSelections() {
        try {
            isSaving = true;
            saveMessage = "";
            saveError = "";
            
            if (!$authStore.isLoggedIn) {
                saveError = "You have to be logged";
                return;
            }

            const result = await fetchPost('/api/protected/save-selections', {
                fruitIds: selectedFruitIds,
                veggieIds: selectedVeggieIds,
                date: currentWeekId
            })
            
            if (result.error) {
                saveError = result.message || "An error occured trying to save your choices";
            } else {
                saveMessage = result.message || "Your choices are saved";
                const total = result.data.totalCount;
                const target = 20;
                
                if (total >= target) {
                    saveMessage += ` Congratulations! You reached your goal on ${target} different fruits and veggies for this week!`;
                } else {
                    saveMessage += ` Du har valgt ${total} ud af ${target} forskellige frugt og grønt i dag.`;
                }
                
                socket.emit("new-selection", {
                    type: "weeklyUpdate",
                    totalFruits: selectedFruitIds.length,
                    totalVeggies: selectedVeggieIds.length
                });
            }
        } catch (error) {
            console.error("Fejl ved gemning:", error);
            saveError = "Der opstod en uventet fejl";
        } finally {
            isSaving = false;
            
            if (saveMessage) {
                setTimeout(() => {
                    saveMessage = "";
                }, 5000);
            }
        }
    }
</script>

<div class="container">

    <h1>Add health to your gut</h1>
    <p>Choose the fruits and greens you ate today.</p>

    {#if saveMessage}
        <div class="success-message">
            {saveMessage}
        </div>
    {/if}

    {#if saveError}
        <div class="error-message">
            {saveError}
        </div>
    {/if}

    <SearchFruitsNVeggies 
        {fruits}
        {veggies}
        bind:filteredFruits
        bind:filteredVeggies
        bind:query 
    />

    <p class="count-display">
        Today you ate: {selectedFruitIds.length + selectedVeggieIds.length} different types of fruits and vegetables
    </p>

    {#if filteredFruits.length > 0 }
        <h2>Fruits</h2>
        <div class="grid">
            {#each filteredFruits as fruit}
            <FoodBox 
                food={fruit} 
                selected={selectedFruitIds.includes(fruit.id)} 
                onToggle={toggleFruit}
                onInfoClick={(food) => selectedFood = food} 
            />
            {/each}    
        </div>
    {/if}

    {#if filteredVeggies.length > 0}
        <h2>Veggies</h2>
        <div class="grid">
            {#each filteredVeggies as veg}
            <FoodBox 
                food={veg} 
                selected={selectedVeggieIds.includes(veg.id)} 
                onToggle={toggleVeggie}
                onInfoClick={(food) => selectedFood = food}  
            />
            {/each}
        </div>
    {/if}

    {#if selectedFood}
    <ShowFoodModal food={selectedFood} on:close={() => selectedFood = null} />
    {/if}



    <div class="save">
        <button class="save-button" on:click={saveSelections} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save my choices'}
        </button>
    </div>
</div>

<style>
    h2 {
        text-align: center;
    }
    .grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .save {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .save-button {
        padding: 0.75rem 1.5rem;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    
    .save-button:hover {
        background-color: #45a049;
    }
    
    .save-button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
    
    .count-display {
        margin-top: 1rem;
        font-size: 1.1rem;
    }
    
    .success-message {
        background-color: #DFF2BF;
        color: #4F8A10;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 1rem;
    }
    
    .error-message {
        background-color: #FFBABA;
        color: #D8000C;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 1rem;
    }
</style>