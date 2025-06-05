<script>
  export let food;
  export let selected = false;
  export let onToggle;
  export let onInfoClick = (food) => {};
</script>

<div
  class="box {selected ? 'selected' : ''}"
  on:click={() => onToggle(food)}
  role="button"
  tabindex="0"
  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle(food)}
>
  <div class="image-wrapper">
    <img src={food.image_url} alt={food.name} />
    {#if selected}
      <div class="checkmark">✔</div>
    {/if}
    <button
      type="button"
      class="info-icon"
      on:click|stopPropagation={() => onInfoClick(food)}
      aria-label="Show info about this food"
    >
      ?
    </button>
  </div>
  <p>{food.name}</p>
</div>


<style>
  .info-icon {
    all: unset;
    cursor: pointer;
    position: absolute;
    top: 6px;
    right: 6px;
    font-size: 1.1rem;
    font-weight: bold;
    color: #666;
    background-color: #f0f0f0;
    padding: 0.2rem 0.4rem;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
  .image-wrapper {
    position: relative;
  }
</style>
