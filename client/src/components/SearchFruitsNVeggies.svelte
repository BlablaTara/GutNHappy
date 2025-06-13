<script>
  export let query = "";

  export let fruits = [];
  export let veggies = [];

  export let filteredFruits = [];
  export let filteredVeggies = [];

  $: if (query.trim().length >= 1) {
    const trimmedQuery = query.trim().toLowerCase();

    filteredFruits = fruits.filter((fruit) =>
      fruit.name.toLowerCase().includes(trimmedQuery)
    );
    filteredVeggies = veggies.filter((veggie) =>
      veggie.name.toLowerCase().includes(trimmedQuery)
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
