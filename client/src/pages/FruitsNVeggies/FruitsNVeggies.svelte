<script>
    import FoodBox from "../../components/FoodBox.svelte";
    import { onMount } from "svelte";
    import { fetchGet } from "../../utils/fetch.js";

    let fruits = [
        {
            id: 1,
            name: "Apple",
            image_url: "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg"
        },
        {
            id: 2,
            name: "Banana",
            image_url: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg"
        }
    ];

    let veggies = [
        {
            id: 3,
            name: "Carrot",
            image_url: "https://upload.wikimedia.org/wikipedia/commons/7/70/Carrot.jpg"
        },
        {
            id: 4,
            name: "Broccoli",
            image_url: "https://upload.wikimedia.org/wikipedia/commons/0/03/Broccoli_and_cross_section_edit.jpg"
        }
    ];

    // let fruits = [];
    // let veggies = [];

    let selectedFoods = new Set();

    // onMount(async () => {
    //     const fruitData = await fetchGet('/api/fruits');
    //     const veggieData = await fetchGet('/api/vegestable');

    //     fruits = fruitData.data;
    //     veggies = veggieData.data;
    // });

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