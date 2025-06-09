<script>
    import { onMount, onDestroy, tick } from "svelte";
    import { authStore } from "../../stores/authStore.js";
    import { fetchGet } from "../../utils/fetch.js";
    import UserProcess from "../../components/UserProcess.svelte";

    import Chart from 'chart.js/auto'

    let username = '';
    $: username = $authStore.user ? $authStore.user.username : "";

    let summary = [];
    let totalFruits = 0;
    let totalVeggies = 0;

    let canvas;
    let chart;

    let chartData = {
        labels: [],
        datasets: [
            {
                label: 'Fruits',
                data: [],
                backgroundColor: '#ffa726'
            },
            {
                label: 'Veggies',
                data: [],
                backgroundColor: '#66bb6a'
            }
        ]
    };

    let chartOptions = {
        responsive: true,
        plugins: { legend: { position: "top" } },
        scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true }
        }
    };

    let hasData = false;

    async function updateData() {
        try {
            const result = await fetchGet('/api/protected/user-weekly-selections');

            if (result.error) {
                return console.error("Error getting weekly data:", result.error);
            }

            const weeklyArray = result.data;

            if (!weeklyArray || weeklyArray.length === 0) {
                hasData = false;
                return;
            }

            hasData = true;
            summary = weeklyArray;

            chartData.labels = weeklyArray.map(entry => entry.label || entry.week);
            chartData.datasets[0].data = weeklyArray.map(entry => entry.fruits);
            chartData.datasets[1].data = weeklyArray.map(entry => entry.veggies);

            //Array sorteret fra ældste til nyeste uge
            const latestWeek = weeklyArray[weeklyArray.length - 1] || { fruits: 0, veggies: 0 };

            totalFruits = latestWeek.fruits;
            totalVeggies = latestWeek.veggies;

            console.log("Weekly data", weeklyArray); //LoG

            if (chart) {
                chart.data = chartData;
                chart.update();
            }

        } catch (error) {
            console.error("Unexpected error fetching weekly data:", error);
        }
       
    };

    onMount(async () => {
        await tick(); 

        await updateData();

        if (hasData && canvas) {
            chart = new Chart(canvas, {
                type: 'bar',
                data: chartData,
                options: chartOptions
            });
        }
    });

    onDestroy(() => {
        if (chart) {
            chart.destroy();
        }
    });

</script>

<div>
    <h1>Welcome {username}</h1>

    <h2>Your weekly healt status:</h2>
    <UserProcess username={username} {totalFruits} {totalVeggies} />
    <!-- <p>{total} out of your weekly goal of 20 different (fruits: {totalFruits}, veggies: {totalVeggies})</p> -->

    <h2>Your intake the last 10 weeks</h2>
    {#if hasData}
        <div class="chart-container">
            <canvas bind:this={canvas}></canvas>
        </div>
    {:else}
    <p>You haven't selected any fruits or vegetables yet. Start your healthy journey today!</p>
    {/if}

</div>

<style>
    .chart-container {
        width: 100%;
        height: 300px;
    }

    canvas {
        width: 100% !important;
        height: 300px !important;
    }
</style>
