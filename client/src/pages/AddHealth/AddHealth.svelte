<script>
  import { onMount } from "svelte";
  import { io } from "socket.io-client";
  import { get } from "svelte/store";
  import { navigate } from "svelte-routing";
  import toastr from "toastr";

  import { fetchGet, fetchPost } from "../../utils/fetch.js";

  import FoodBox from "../../components/FoodBox.svelte";
  import SearchFruitsNVeggies from "../../components/SearchFruitsNVeggies.svelte";
  import ShowFoodModal from "../../components/ShowFoodModal.svelte";
  import { BASE_URL } from "../../stores/generalStore.js";

  const socket = io(get(BASE_URL), {
    withCredentials: true,
  });

  let query = "";

  let fruits = [];
  let veggies = [];

  let filteredFruits = [];
  let filteredVeggies = [];

  let selectedFood = null;
  let selectedFruitIds = [];
  let selectedVeggieIds = [];

  let currentWeekId = null;
  let isSaving = false;

  onMount(async () => {
    await Promise.all([loadFruits(), loadVeggies(), loadUserSelections()]);
  });

  async function loadFruits() {
    const fruitsResult = await fetchGet("/api/protected/fruits");
    if (!fruitsResult.error) {
      fruits = fruitsResult.data;
    }
  }

  async function loadVeggies() {
    const veggiesResult = await fetchGet("/api/protected/vegetables");
    if (!veggiesResult.error) {
      veggies = veggiesResult.data;
    }
  }

  async function loadUserSelections() { 
    const selectionsResult = await fetchGet("/api/protected/user-selections");

    if (!selectionsResult.error && selectionsResult.success) {
      currentWeekId = selectionsResult.data.weekId;
      selectedFruitIds = selectionsResult.data.fruits.map((fruit) => fruit.id);
      selectedVeggieIds = selectionsResult.data.vegetables.map((veg) => veg.id);
    }
  }

  function toggleFruit(fruit) {
    if (selectedFruitIds.includes(fruit.id)) {
      selectedFruitIds = selectedFruitIds.filter((id) => id !== fruit.id);
    } else {
      selectedFruitIds = [...selectedFruitIds, fruit.id];
    }
  }

  function toggleVeggie(veggie) {
    if (selectedVeggieIds.includes(veggie.id)) {
      selectedVeggieIds = selectedVeggieIds.filter((id) => id !== veggie.id);
    } else {
      selectedVeggieIds = [...selectedVeggieIds, veggie.id];
    }
  }

  async function saveSelections() {
    try {
      isSaving = true;

      const SaveResult = await fetchPost("/api/protected/save-selections", {
        fruitIds: selectedFruitIds,
        veggieIds: selectedVeggieIds,
        date: currentWeekId,
      });

      if (!SaveResult.success) {
        toastr.error(
          "Sorry. An error occured trying to save your choices. Try again"
        );
      } else {
        toastr.success("Succesfully saved! - redirecting...");

        socket.emit("new-selection", {
          totalFruits: selectedFruitIds.length,
          totalVeggies: selectedVeggieIds.length,
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch {
      toastr.error("Unexpected error while saving.");
    } finally {
      isSaving = false;
    }
  }
</script>

<div class="container">
  <h1>Add health to your gut</h1>

  <h2>Choose the fruits and greens you ate today.</h2>

  <div class="searchBar">
    <SearchFruitsNVeggies
      {fruits}
      {veggies}
      bind:filteredFruits
      bind:filteredVeggies
      bind:query
    />
  </div>

  <div class="save">
    <button class="save-button" on:click={saveSelections} disabled={isSaving}>
      {isSaving ? "Saving..." : "Save my choices"}
    </button>
  </div>

  {#if filteredFruits.length > 0}
    <h2>Fruits</h2>
    <div class="grid">
      {#each filteredFruits as fruit}
        <FoodBox
          food={fruit}
          selected={selectedFruitIds.includes(fruit.id)}
          onToggle={toggleFruit}
          onInfoClick={(food) => (selectedFood = food)}
        />
      {/each}
    </div>
  {/if}

  {#if filteredVeggies.length > 0}
    <h2>Veggies</h2>
    <div class="grid">
      {#each filteredVeggies as veg}
        <FoodBox
          highlightSelected={true}
          food={veg}
          selected={selectedVeggieIds.includes(veg.id)}
          onToggle={toggleVeggie}
          onInfoClick={(food) => (selectedFood = food)}
        />
      {/each}
    </div>
  {/if}

  {#if selectedFood}
    <ShowFoodModal food={selectedFood} onClose={() => (selectedFood = null)} />
  {/if}
</div>

<style>
  h2 {
    text-align: center;
  }
  .searchBar {
    display: flex;
    justify-content: center;
    margin: 1rem 0 2rem;
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
    background-color: #fd8097;
    color: white;
    border: none;
    border-radius: 15px;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }
  .save-button:hover {
    background-color: #e65670;
  }
  .save-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
</style>
