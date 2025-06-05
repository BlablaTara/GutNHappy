<script>

    export let fruits = [];
    export let veggies = [];

    let query = '';
    let filteredFruits = [];
    let filteredVeggies = [];

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

{#if filteredFruits.length > 0}
    <h3>Fruits</h3>
    <ul>
        {#each filteredFruits as fruit}
        <li>{fruit.name}</li>
        {/each}
    </ul>
{/if}

{#if filteredVeggies.length > 0}
    <h3>Veggies</h3>
    <ul>
        {#each filteredVeggies as veggie}
        <li>{veggie.name}</li>
        {/each}
    </ul>
{/if}