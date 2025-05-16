<script>
    import FoodBox from "../../components/FoodBox.svelte";
    import { onMount } from "svelte";
    import { fetchGet } from "../../utils/fetch.js";

    let fruits = [];
    let veggies = [];

    let selectedFoods = new Map();

    onMount(async () => {
        console.log("Fruits N Veggies route Mountet");
        const fruitData = await fetchGet('/api/fruits');
        const veggieData = await fetchGet('/api/vegetables');

        fruits = fruitData.data;
        veggies = veggieData.data;

         // Tilføj bedre debug output
        fruits.forEach(fruit => {
            console.log(`Fruit ID: ${fruit.id}, Name: ${fruit.name}`);
        });
        
        veggies.forEach(veg => {
            console.log(`Veggie ID: ${veg.id}, Name: ${veg.name}`);
        });
    });

    function toggleFood(food) {
        console.log("Toggling food:", food); //hvad sker der når vi toggler food?

        const uniqueKey = `${food.type || 'unknown'}-${food.id}`;
        console.log("Generated uniqueKey:", uniqueKey); //log

        if (selectedFoods.has(uniqueKey)) {
            console.log("Removing from selection"); //log
            selectedFoods.delete(uniqueKey);
        } else {
            console.log("Adding to selection"); //log
            selectedFoods.set(uniqueKey, food);
        }
        // Log hele selectedFoods efter opdatering
        console.log("Updated selectedFoods:", [...selectedFoods.keys()]);

        selectedFoods = selectedFoods;
    }

    function isSelected(food) {
        const uniqueKey = `${food.type || 'unknown'}-${food.id}`;
        const result = selectedFoods.has(uniqueKey);
        // Uncommenter næste linje for ekstrem debug
        console.log(`Checking if ${uniqueKey} is selected:`, result);
        return result;
    }

</script>

<h1>Fruits 'N Veggies</h1>

<h2>Fruits</h2>
<div class="grid">
    {#each fruits as fruit}
    <FoodBox food={{...fruit, type: 'fruit'}} selected={isSelected({...fruit, type: 'fruit'})} onToggle={toggleFood} />
    {/each}    
</div>

<h2>Veggies</h2>
<div class="grid">
    {#each veggies as veg}
    <FoodBox food={{...veg, type: 'veggie'}} selected={isSelected({...veg, type: 'veggie'})} onToggle={toggleFood} />
    {/each}

</div>

<style>
    .grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
  </style>