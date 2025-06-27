<script>
  export let food;
  export let selected = false;
  export let onToggle;

  function toggle() {
    onToggle(food);
  }
</script>

<button
  class="box {selected ? 'selected' : ''}"
  on:click={toggle}
  type="button"
>
  <div class="image-wrapper">
    <img src={food.image_url} alt={food.name} />
    {#if selected}
      <div class="checkmark">✔</div>
    {/if}
  </div>
  <p>{food.name}</p>
</button>

<style>
  button.box {
    all: unset;
    border: 2px solid gray;
    padding: 1rem;
    border-radius: 0.5rem;
    text-align: center;
    cursor: pointer;
    width: 120px;

    position: relative;
    background-color: rgb(254, 251, 238);
  }

  .selected {
    border-color: green;
    background-color: #eaffea;
  }

  .image-wrapper {
    position: relative;
  }

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 0.5rem;
  }
  .checkmark {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: green;
    color: white;
    font-weight: bold;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  }
</style>
