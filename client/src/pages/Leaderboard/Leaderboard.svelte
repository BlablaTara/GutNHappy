<script>
    import { onMount } from "svelte";
    import { fetchGet } from "../../utils/fetch.js";
    import UserProcess from "../../components/UserProcess.svelte";
    import { io } from "socket.io-client";

    let users = [];
    let socket;

    $: sortedUsers = Array.isArray(users) 
        ? [...users].sort((a, b) => {
            const totalA = a.totalFruits + a.totalVeggies;
            const totalB = b.totalFruits + b.totalVeggies;
        return totalB - totalA;
    })
    : [];

    async function getLeaderboard() {
        const result = await fetchGet("/api/protected/leaderboard")
        if (result.success && Array.isArray(result.data)) {
            users = result.data;
        } else {
            users = [];
        }
    };

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