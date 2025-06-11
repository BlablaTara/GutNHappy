<script>
    import { onMount } from "svelte";
    import { fetchGet } from "../../utils/fetch.js";
    import UserProcess from "../../components/UserProcess.svelte";
    import { authStore } from "../../stores/authStore.js"
    import { get } from "svelte/store";
    import { io } from "socket.io-client";

    let users = [];
    let socket;
    let currentWeek = "";

    $: currentUser = get(authStore)?.user?.username;

    $: sortedUsers = Array.isArray(users) 
        ? [...users].sort((a, b) => {
            const totalA = Number(a.totalFruits) + Number(a.totalVeggies);
            const totalB = Number(b.totalFruits) + Number(b.totalVeggies);
        return totalB - totalA;
    })
    : [];


    async function getLeaderboard() {
        const result = await fetchGet("/api/protected/leaderboard")
        if (result.success && Array.isArray(result.data)) {
            users = result.data;
            currentWeek = result.week;
            console.log("Leaderboard data:", result.data);
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

<div class="container">
    <h1>Leaderboard</h1>

    <h2 class="rank-header">
        Top eaters for gut diversity this week:
    </h2>
    <h3 class="show-week">
        Week: {currentWeek.split("-") [1]}
    </h3>

    {#each sortedUsers as user, index}
    <div class="ranking {user.username === currentUser ? 'me' : ''}">
        <span class="medal">{index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}` }</span>
        <UserProcess username={user.username} totalFruits={Number(user.totalfruits)} totalVeggies={Number(user.totalveggies)} isCurrentUser={user.username === currentUser} />

    </div>
    {/each}
</div>

<style>
    .rank-header {
        font-size:2rem;
        margin-bottom: 1rem;
    }
    .show-week {
        margin-top: 2rem;
        margin-bottom: 0.1;
        color: #666;

    }

    .ranking {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        padding: 0.5rem;
        border-bottom: 1px solid #ccc;
    }
    .ranking :global(.user-process) {
        flex-grow: 1;
    }

    .medal {
        font-size: 3.5rem;
        width: 4rem;
        text-align: center;
        margin-top: 10px;
    }
</style>