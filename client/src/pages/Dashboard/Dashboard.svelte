<script>
  import { onMount, onDestroy, tick } from "svelte";
  import { Link } from "svelte-routing";
  import toastr from "toastr";
  import Chart from "chart.js/auto";
  import annotationPlugin from "chartjs-plugin-annotation";

  import { authStore } from "../../stores/authStore.js";
  import { fetchGet } from "../../utils/fetch.js";

  import UserProcess from "../../components/UserProcess.svelte";
  import FoodBox from "../../components/FoodBox.svelte";
  import ShowFoodModal from "../../components/ShowFoodModal.svelte";

  Chart.register(annotationPlugin);

  let username = "";
  $: username = $authStore.user ? $authStore.user.username : "";

  let summary = [];
  let totalFruits = 0;
  let totalVeggies = 0;
  let selectedFood = null;

  let canvas;
  let chart;

  let chartData = {
    labels: [],
    datasets: [
      {
        label: "Fruits",
        data: [],
        backgroundColor: "#f6c02a",
      },
      {
        label: "Veggies",
        data: [],
        backgroundColor: "#b7d255",
      },
    ],
  };

  let maxYValue = Math.max(
    20,
    ...chartData.datasets[0].data,
    ...chartData.datasets[1].data
  );

  let chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      annotation: {
        annotations: {
          goalLine: {
            type: "line",
            yMin: 10,
            yMax: 10,
            borderColor: "rgba(0, 0, 0, 0.5)",
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              enabled: true,
              content: "Goal halfway (10)",
              position: "end",
              backgroundColor: "rgbs(0, 0, 0, 0.7)",
              color: "#fff",
              font: {
                style: "italic",
              },
            },
          },
        },
      },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true, max: maxYValue },
    },
  };

  let hasData = false;

  let selectedFruits = [];
  let selectedVeggies = [];

  async function updateData() {
    try {
      const uwsResult = await fetchGet("/api/protected/user-weekly-selections");
      const weeklyArray = uwsResult.data;

      if (!uwsResult.success || !uwsResult.data) {
        toastr.error("Could not load weekly selections.");
        return;
      }

      hasData = true;
      summary = weeklyArray;

      chartData.labels = weeklyArray.map((entry) => entry.label || entry.week);
      chartData.datasets[0].data = weeklyArray.map((entry) => entry.fruits);
      chartData.datasets[1].data = weeklyArray.map((entry) => entry.veggies);

      const latestWeek = weeklyArray[weeklyArray.length - 1] || {
        fruits: 0,
        veggies: 0,
      };

      totalFruits = latestWeek.fruits;
      totalVeggies = latestWeek.veggies;

      const selectionsResponse = await fetchGet(
        "/api/protected/user-selections"
      );

      if (selectionsResponse?.data) {
        selectedFruits = selectionsResponse.data.fruits || [];
        selectedVeggies = selectionsResponse.data.vegetables || [];
      }

      if (chart) {
        chart.data = chartData;
        chart.update();
      }
    } catch {
      toastr.error(
        "Something went wrong while loading your dashboard data. Please try again later."
      );
    }
  }

  onMount(async () => {
    await tick();
    await updateData();

    if (hasData && canvas) {
      chart = new Chart(canvas, {
        type: "bar",
        data: chartData,
        options: chartOptions,
      });
    }
  });

  onDestroy(() => {
    if (chart) {
      chart.destroy();
    }
  });
</script>

<div class="container">
  <h1>🌟Welcome {username}🌟</h1>

  {#if selectedFruits.length === 0 && selectedVeggies.length === 0}
    <div class="start">
      <p>You haven't selected any fruits or vegetables yet</p>
      <p>
        🌱Start your healthy journey <Link class="start-link" to="/add-health"
          >here!</Link
        >🌱
      </p>
    </div>
  {/if}

  <h2>Your weekly healt status:</h2>
  <UserProcess {username} {totalFruits} {totalVeggies} />

  <h2>Your intake the last 10 weeks</h2>
  {#if hasData}
    <div class="chart-container">
      <canvas bind:this={canvas}></canvas>
    </div>
  {:else}
    <p>You haven't selected any fruits or vegetables yet</p>
  {/if}

  {#if selectedFruits.length || selectedVeggies.length}
    <h2>This weeks intake:</h2>
    <div class="selected-grid">
      {#each selectedFruits as fruit}
        <FoodBox
          food={fruit}
          selected={true}
          showCheckmark={false}
          highlightSelected={false}
          onToggle={() => {}}
          onInfoClick={(food) => (selectedFood = food)}
        />
      {/each}
      {#each selectedVeggies as veggie}
        <FoodBox
          food={veggie}
          selected={true}
          showCheckmark={false}
          highlightSelected={false}
          onToggle={() => {}}
          onInfoClick={(food) => (selectedFood = food)}
        />
      {/each}
    </div>
  {:else}
    <p>You haven't added any fruits or vegetables for this week yet.</p>
  {/if}

  {#if selectedFood}
    <ShowFoodModal food={selectedFood} onClose={() => (selectedFood = null)} />
  {/if}
</div>

<style>
  canvas {
    width: 100% !important;
    height: 300px !important;
  }
  .start {
    text-align: center;
    font-size: 1.5rem;
  }
  .start-link {
    font-weight: bold;
    text-decoration-line: underline;
  }
  .chart-container {
    width: 100%;
    height: 300px;
  }
  .selected-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
  }
</style>
