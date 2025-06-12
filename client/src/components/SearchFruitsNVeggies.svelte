<script>

    export let fruits = [];
    export let veggies = [];

    export let filteredFruits = [];
    export let filteredVeggies = [];

    export let query = '';

    $: if (query.trim().length >= 1) {
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
    class="search-input"
    type="text"
    placeholder="Search ..."
    bind:value={query}
/>

<style>
    .search-input {
        border: 2px solid rgba(211, 211, 211, 0.536);
        border-radius: 15px;
        padding: 10px 20px;
        width: 50%;
        font-size: 1rem;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
        border-width: 3px;
    }

</style>
