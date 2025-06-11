<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    function close() {
    dispatch('close');
    }

    export let food;

</script>


<div
  class="modal-backdrop"
  role="button"
  tabindex="0"
  on:click={close}
  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && close()}
>
  <div
    class="modal-content"
    on:click|stopPropagation
    on:keydown={() => {}}
    role="dialog"
    aria-modal="true"
    tabindex="0"
    >
    <button 
      class="close-button" 
      on:click={close}>✖</button>

    <img src={food.image_url} alt={food.name} />
    <h2>{food.name}</h2>
    <h3>🌟Health Benefits🌟</h3>
    <p class="benefit">{food.health_benefits}</p>
  </div>
</div>

<style>
    img {
        width: 150px;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
    }

    h3 {
      margin-top: 2rem;
    }

    .modal-backdrop {
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    .modal-content {
        background: rgb(230, 227, 214);
        padding: 2rem;
        border-radius: 1rem;
        max-width: 400px;
        width: 90%;
        text-align: center;
        position: relative;
    }
    .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #eee;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        border-radius: 50%;
        padding: 0.2rem 0.5rem;
    }
    .benefit {
      margin-top: 1rem;
      font-size: 1rem;
      color: #666;
      padding: 0.8rem;
      line-height: 1.4;
      background-color: #ffffff;
      border-radius: 0.75rem;
    }


</style>