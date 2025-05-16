<script>
    import FoodBox from "../../components/FoodBox.svelte";
    import { onMount } from "svelte";
    import { authStore } from "../../stores/authStore.js";
    import { fetchGet } from "../../utils/fetch.js";

    let name = '';

    $: name = $authStore.user ? $authStore.user.name : "";

    let fruits = [];
    let veggies = [];

    let selectedFruitIds = [];
    let selectedVeggieIds = [];

    onMount(async () => {
        console.log("Fruits N Veggies route Mountet");
        const fruitData = await fetchGet('/api/fruits');
        const veggieData = await fetchGet('/api/vegetables');

        fruits = fruitData.data;
        veggies = veggieData.data;
    });

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
</script>

<h1>Fruits 'N Veggies</h1>

<h2>Fruits</h2>
<div class="grid">
    {#each fruits as fruit}
    <FoodBox 
        food={fruit} 
        selected={selectedFruitIds.includes(fruit.id)} 
        onToggle={toggleFruit} 
    />
    {/each}    
</div>

<h2>Veggies</h2>
<div class="grid">
    {#each veggies as veg}
    <FoodBox 
        food={veg} 
        selected={selectedVeggieIds.includes(veg.id)} 
        onToggle={toggleVeggie} 
    />
    {/each}
</div>

<style>
    .grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
</style>