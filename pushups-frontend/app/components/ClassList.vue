<script setup>
import { onMounted } from 'vue'
import { useClassStore } from '~/stores/classStore'

const classStore = useClassStore()

onMounted(() => {
  classStore.fetchDailyClasses()
})

const formatTime = (time) => time.slice(0, 5)
</script>

<template>
  <div>
    <p class="text-2xl italic text-gray-100 mb-2">{{ classStore.currentDay }}</p>

    <div v-if="classStore.loading" class="text-gray-200">Loading...</div>
    <div v-else-if="classStore.error" class="text-red-400">{{ classStore.error }}</div>

    <div v-else v-for="gc in classStore.classes" :key="gc.id" class="flex flex-col justify-between items-center py-1">
      <p class="font-semibold text-xl">{{ gc.name }}</p>
      <p class="text-md text-gray-300">{{ formatTime(gc.startTime) }} - {{ formatTime(gc.endTime) }}</p>
    </div>
  </div>
</template>