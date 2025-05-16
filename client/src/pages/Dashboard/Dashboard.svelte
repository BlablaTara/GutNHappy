<script>
    import { onMount, onDestroy } from "svelte";
    import { authStore } from "../../stores/authStore.js";
    import { fetchGet } from "../../utils/fetch.js";

    import Chart from 'chart.js/auto'

    let name = '';
    $: name = $authStore.user ? $authStore.user.name : "";

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
        plugins: {
            legend: {
                position: "top"
            }
            
        },
        scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true }
        }
    };

    async function updateData() {
  const result = await fetchGet('/api/protected/user-weekly-selections');

  if (result.error) {
    console.error("Error getting weekly data:", result.error);
    return;
  }

  const weeklyArray = result.data;

  summary = weeklyArray;

  chartData.labels = weeklyArray.map(entry => entry.week);
  chartData.datasets[0].data = weeklyArray.map(entry => entry.fruits);
  chartData.datasets[1].data = weeklyArray.map(entry => entry.veggies);

  totalFruits = weeklyArray.reduce((sum, e) => sum + e.fruits, 0);
  totalVeggies = weeklyArray.reduce((sum, e) => sum + e.veggies, 0);

  if (chart) {
    chart.data = chartData;
    chart.update();
  }
}

    onMount(() => {
    chart = new Chart(canvas, {
        type: 'bar',
        data: chartData,
        options: chartOptions
    });

    updateData();
    });

    onDestroy(() => {
        if (chart) {
            chart.destroy();
        }
    });

    $: total = totalFruits + totalVeggies;
    $: progress = Math.min((total / 20) * 100, 100);
</script>

<div>
    <h1>Dashboard</h1>
    <p>Welcome {name}</p>

    <h2>Your weekly healt status</h2>

    <div class="progress-container">
        <div class="fruit-bar" style="width: {(totalFruits / 20) * 100}%"></div>
        <div class="veggie-bar" style="width: {(totalVeggies / 20) * 100}%"></div>
    </div>
    <p>{total} out of your weekly goal of 20 different ({totalFruits}) fruits, and ({totalVeggies}) veggies</p>

    <h2>Your intake the last 12 weeks</h2>
    <div class="chart-container">
        <canvas bind:this={canvas}></canvas>
    </div>
</div>

<style>
    .progress-container {
        height: 30px;
        background: #e0e0e0;
        border-radius: 20px;
        overflow: hidden;
        margin-bottom: 2rem;
    }

    .fruit-bar {
        background-color: #ffa726;
        height: 100%;
    }

    .veggie-bar {
        background-color: #66bb6a;
        height: 100%;
    }

    .chart-container {
        width: 100%;
        height: 300px;
    }

    canvas {
        width: 100% !important;
        height: 300px !important;
    }
</style>
