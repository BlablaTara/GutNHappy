<script>
  export let username;
  export let totalFruits = 0;
  export let totalVeggies = 0;
  export let isCurrentUser = false;

  $: fruits = Number(totalFruits);
  $: veggies = Number(totalVeggies);
  $: total = totalFruits + totalVeggies;
  $: progress = Math.min((total / 20) * 100, 100);
</script>

<div class="user-process">
  <p class:is-me={isCurrentUser}>
    <strong>{username}{isCurrentUser ? " (you)" : ""}</strong>: {total}/20
  </p>
  <div class="progress-container">
    <div
      class="fruit-bar"
      style="width: {total > 0 ? (fruits / total) * progress : 0}%"
    ></div>
    <div
      class="veggie-bar"
      style="width: {total > 0 ? (veggies / total) * progress : 0}%"
    ></div>
  </div>
</div>

<style>
  .user-process {
    margin-bottom: 1rem;
  }
  .progress-container {
    display: flex;
    height: 30px;
    background: #e0e0e0;
    border-radius: 15px;
    overflow: hidden;
  }
  .fruit-bar {
    background-color: #f6c02a;
    height: 100%;
  }
  .veggie-bar {
    background-color: #b7d255;
    height: 100%;
  }
  .is-me {
    font-size: 1.6rem;
    color: #61b2e3;
  }
</style>
