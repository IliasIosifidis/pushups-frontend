<script setup>
import { ref, watch } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js'
import { useApi } from '~/pagescomposables/useApi.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)

const props = defineProps({
  show: { type: Boolean, default: false },
  member: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const loading = ref(false)
const chartData = ref(null)

const chartOptions = {
  responsive: true,
  plugins: {
    title: { display: false },
    tooltip: { enabled: true },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1, color: '#9ca3af' },
      grid: { color: 'rgba(255,255,255,0.1)' },
    },
    x: {
      ticks: { color: '#9ca3af' },
      grid: { color: 'rgba(255,255,255,0.1)' },
    },
  },
}

watch(() => props.show, async (val) => {
  if (val && props.member) {
    loading.value = true
    try {
      const api = useApi()
      const { data } = await api.get(`/booking/memberStats/${props.member.id}`)
      buildChart(data)
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }
})

function buildChart(dates) {
  const counts = {}
  dates.forEach(date => {
    const d = new Date(date + 'T00:00:00')
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    counts[key] = (counts[key] || 0) + 1
  })

  const sortedKeys = Object.keys(counts).sort()
  const labels = sortedKeys.map(k => {
    const [year, month] = k.split('-')
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'short' })
    return `${monthName} ${year}`
  })

  chartData.value = {
    labels,
    datasets: [{
      label: 'Visits',
      data: sortedKeys.map(k => counts[k]),
      backgroundColor: '#7c3aed',
      borderRadius: 4,
    }],
  }
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/70" @click="emit('close')"></div>

    <div class="relative bg-gray-900 border border-white/20 rounded-lg p-6 w-[600px]">
      <button @click="emit('close')" class="absolute top-3 right-3 text-gray-400 hover:text-white text-xl">×</button>

      <template v-if="member">
        <h2 class="text-xl font-bold mb-1">{{ member.firstName }} {{ member.lastName }}</h2>
        <p class="text-sm text-gray-400">{{ member.email }}</p>
        <p class="text-sm text-gray-400 mb-6">{{ member.phoneNumber }}</p>

        <h3 class="text-sm font-bold text-gray-300 mb-2">Attendance</h3>

        <div v-if="loading" class="text-gray-400">Loading chart...</div>
        <Bar v-else-if="chartData" :data="chartData" :options="chartOptions" />
        <p v-else class="text-gray-500 text-sm">No attendance data</p>
      </template>
    </div>
  </div>
</template>