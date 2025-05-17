<script>
    import { onMount } from "svelte";
    import { fetchGet } from "../../utils/fetch.js";
    import UserProcess from "../../components/UserProcess.svelte";

    let users = [];

    async function getLeaderboard() {
        const result = await fetchGet("/api/leaderbord")
        if (result.success) {
            users = result.data;
        }
    }

    onMount(() => {
        getLeaderboard();
    });
</script>

<h1>Leaderboard</h1>

{#each users as user}
    <UserProcess name={user.name} totalFruits={user.totalFruits} totalVeggies={user.totalVeggies} />
{/each}