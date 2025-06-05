<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    function close() {
    dispatch('close');
    }

    export let food;

</script>

<!-- backdrop -->
<div
  class="modal-backdrop"
  role="button"
  tabindex="0"
  on:click={close}
  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && close()}
>
  <!-- indhold -->
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
  </div>
</div>

<style>
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
        background: white;
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

    img {
        width: 150px;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
    }
</style>