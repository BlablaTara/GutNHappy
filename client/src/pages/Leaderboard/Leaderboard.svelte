<script>
    import { onMount } from "svelte";
    import { fetchGet } from "../../utils/fetch.js";
    import UserProcess from "../../components/UserProcess.svelte";
    import { io } from "socket.io-client";

    export let users = [];
    let socket;

    $: sortedUsers = [...users].sort((a, b) => {
        const totalA = a.fruitCount + a.veggieCount;
        const totalB = b.fruitCount + b.veggieCount;
        return totalB - totalA;
    })

    async function getLeaderboard() {
        const result = await fetchGet("/api/protected/leaderboard")
        if (result.success) {
            users = result.data;
        }
    }

    onMount(() => {
        socket = io("http://localhost:8080", {
        withCredentials: true
        });

        getLeaderboard();

        socket.on("leaderboard-update", (data) => {
            console.log("Recieved update:", data);
            getLeaderboard();   
        });
    });

</script>

<h1>Leaderboard</h1>

{#each sortedUsers as user, index}
<div class="ranking">
    <span class="medal">{index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}` }</span>
    <UserProcess name={user.name} totalFruits={user.totalFruits} totalVeggies={user.totalVeggies} />

</div>
{/each}