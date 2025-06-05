<script>

    export let fruits = [];
    export let veggies = [];

    export let filteredFruits = [];
    export let filteredVeggies = [];

    export let query = '';

    $: if (query.trim().length >= 2) {
        const lowerQuery = query.trim().toLowerCase();

        filteredFruits = fruits.filter(fruit => 
            fruit.name.toLowerCase().includes(lowerQuery)
        );
        filteredVeggies = veggies.filter(veggie =>
            veggie.name.toLowerCase().includes(lowerQuery)
        );
    } else {
        filteredFruits = fruits;
        filteredVeggies = veggies;
    }
</script>

<input
    type="text"
    placeholder="Search ..."
    bind:value={query}
/>
