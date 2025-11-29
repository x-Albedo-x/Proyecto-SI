<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  type: {
    type: String,
    default: 'line'
  },
  labels: Array,
  datasets: Array,
  title: String,
  options: Object
})

const chartCanvas = ref(null)
let chartInstance = null

const initChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value?.getContext('2d')
  if (!ctx) return

  chartInstance = new Chart(ctx, {
    type: props.type,
    data: {
      labels: props.labels || [],
      datasets: props.datasets || []
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: !!props.title,
          text: props.title
        },
        legend: {
          display: true,
          position: 'top'
        }
      },
      ...props.options
    }
  })
}

onMounted(() => {
  initChart()
})

watch([() => props.labels, () => props.datasets], () => {
  initChart()
}, { deep: true })
</script>

<style scoped>
.chart-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}
</style>
