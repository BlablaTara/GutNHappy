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

  <button
    type="button"
    class="info-icon"
    on:click|stopPropagation={() => onInfoClick(food)}
    aria-label="Show info about this food"
  >?</button>

  <div class="image-wrapper">
    <img src={food.image_url} alt={food.name} />
    {#if selected}
      <div class="checkmark">✔</div>
    {/if}

  </div>
  <p>{food.name}</p>
</div>


<style>
  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 0.5rem;
  }
  .box {
    width: 120px;
    border: 2px solid #ccc;
    border-radius: 1rem;
    padding: 1rem;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
    position: relative;
    background-color: rgb(254, 251, 238);
    
  }
  .box:hover {
    border-color: #666;
    box-shadow: 0 px 6px rgba(0, 0, 0, 0.1);
  }
  .box.selected {
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
    background-color: #EAFFEA;

  }
  .image-wrapper {
    position: relative;
  }

  .checkmark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #4CAF50;
    font-size: 6rem;
    font-weight: bold;
  }
    .info-icon {
    all: unset;
    cursor: pointer;
    position: absolute;
    top: 6px;
    right: 6px;
    font-size: 0.8rem;
    font-weight: bold;
    color: #666;
    padding: 0.1rem 0.4rem;
    border: 2px solid #666;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    z-index: 20;
  }
  p {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 500;
  }
</style>
