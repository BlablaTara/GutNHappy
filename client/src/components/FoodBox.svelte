<script>
  export let food;
  export let selected = false;
  export let onToggle;
  export let onInfoClick = (food) => {};
  export let showCheckmark = true;
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
    {#if selected && showCheckmark}
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
    /* border: 2px solid #ccc; */
    border-radius: 1rem;
    padding: 1rem;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    position: relative;
    background-color: rgb(255, 255, 255);
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.12);
    
  }
  .box:hover {
    /* border-color: #9f9f9f;
    box-shadow: 4px 6px rgba(0, 0, 0, 0.1); */
    transform: scale(1.05);
  }
  .box.selected {
    border-color: #4CAF50;
    box-shadow: 0px 0px 8px rgba(76, 175, 80, 0.2);
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
    font-size: 9rem;
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
    color: #8d8d8d;
    padding: 0.1rem 0.4rem;
    border: 2px solid #8d8d8d;
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
