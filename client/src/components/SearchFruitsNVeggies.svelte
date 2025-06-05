<script>

    export let fruits = [];
    export let veggies = [];

    export let filteredFruits = [];
    export let filteredVeggies = [];

    let query = '';

    $: if (query.trim().length >= 2) {
        const lowerQuery = query.trim().toLowerCase();

        filteredFruits = fruits.filter(fruit => 
            fruit.name.toLowerCase().includes(lowerQuery)
        );
        filteredVeggies = veggies.filter(veggie =>
            veggie.name.toLowerCase().includes(lowerQuery)
        );
    } else {
        filteredFruits = [];
        filteredVeggies = [];
    }
</script>

<input
    type="text"
    placeholder="Search ..."
    bind:value={query}
/>
