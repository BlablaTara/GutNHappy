<script>
    export let username;
    export let totalFruits = 0;
    export let totalVeggies = 0;

    $: total = totalFruits + totalVeggies;
    $: progress = Math.min((total / 20) * 100, 100);
</script>

<div class="user-process">
    <p><strong>{username}</strong>: {total}/20</p>
    <div class="progress-container">
        <div class="fruit-bar" style="width: {(totalFruits / total) * progress}%"></div>
        <div class="veggie-bar" style="width: {(totalVeggies / total) * progress}%"></div>

    </div>
</div>

<style>
    .user-process {
        margin-bottom: 1rem;
    }

    .progress-container {
        display: flex;
        height: 20px;
        background: #e0e0e0;
        border-radius: 10px;
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