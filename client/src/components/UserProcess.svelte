<script>
    export let username;
    export let totalFruits = 0;
    export let totalVeggies = 0;

    $: fruits = Number(totalFruits);
    $: veggies = Number(totalVeggies);
    $: total = totalFruits + totalVeggies;
    $: progress = Math.min((total / 20) * 100, 100);

    $: console.log(`Rendering ${username}: fruits=${fruits}, veggies=${veggies}, total=${total}, progress=${progress}`);

</script>

<div class="user-process">
    <p><strong>{username}</strong>: {total}/20</p>
    <div class="progress-container">
        <div class="fruit-bar" style="width: {total > 0 ? (fruits / total) * progress : 0}%"></div>
        <div class="veggie-bar" style="width: {total > 0 ? (veggies / total) * progress : 0}%"></div>

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
        background-color: #ffa726;
        height: 100%;
    }

    .veggie-bar {
        background-color: #66bb6a;
        height: 100%;
    }
</style>