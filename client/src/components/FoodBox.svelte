<script>
    export let food;
    export let selected = false;
    export let onToggle;

    function toggle() {
        onToggle(food);
    }

</script>

<button class="box {selected ? 'selected' : ''}" on:click={toggle} type="button">
    <img src={food.image_url} alt={food.name} />
    <p>{food.name}</p>

</button>

<style>
    button.box {
      all: unset; /* fjerner standard-styling */
      border: 2px solid gray;
      padding: 1rem;
      border-radius: 0.5rem;
      text-align: center;
      cursor: pointer;
      width: 120px;
    }
  
    .selected {
      border-color: green;
      background-color: #eaffea;
    }
  
    img {
      width: 100px;
      height: 100px;
      object-fit: cover;
    }
  </style>