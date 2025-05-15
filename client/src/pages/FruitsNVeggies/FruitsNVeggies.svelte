<script>
    import FoodBox from "../../components/FoodBox.svelte";
    import { onMount } from "svelte";
    import { fetchGet } from "../../utils/fetch.js";

    let fruits = [];
    let veggies = [];

    let selectedFoods = new Set();

    onMount(async () => {
        console.log("Fruits N Veggies route Mountet");
        const fruitData = await fetchGet('/api/fruits');
        const veggieData = await fetchGet('/api/vegetables');

        fruits = fruitData.data;
        veggies = veggieData.data;

        console.log("fruits:", fruits);
        console.log("veggies:", veggies);
    });

    function toggleFood(food) {
        if (selectedFoods.has(food.id)) {
            selectedFoods.delete(food.id);
        } else {
            selectedFoods.add(food.id);
        }
    }

</script>

<h1>Fruits 'N Veggies</h1>

<h2>Fruits</h2>
<div class="grid">
    {#each fruits as fruit}
    <FoodBox food={fruit} selected={selectedFoods.has(fruit.id)} onToggle={toggleFood} />
    {/each}    
</div>

<h2>Veggies</h2>
<div class="grid">
    {#each veggies as veg}
    <FoodBox food={veg} selected={selectedFoods.has(veg.id)} onToggle={toggleFood} />
    {/each}

</div>

<style>
    .grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
  </style>