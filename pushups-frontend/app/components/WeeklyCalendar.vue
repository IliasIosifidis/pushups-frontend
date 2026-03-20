<script setup>
import { onMounted, computed, ref } from 'vue'
import { useBookingStore } from '~/stores/bookingStore'
import { useAuthStore } from '~/stores/authStore'

const bookingStore = useBookingStore()
const authStore = useAuthStore()
const showBookingModal = ref(false)
const selectedClassId = ref(null)
const selectedClassName = ref('')
const selectedDate = ref('')

onMounted(() => {
  bookingStore.loadCurrentWeek()
})

const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const timeSlots = computed(() => {
  if (!bookingStore.weekData?.days) return []
  const firstDay = Object.values(bookingStore.weekData.days).find(day => day.length > 0)
  if (!firstDay) return []
  return firstDay.map(c => ({
    time: (c.startTime || c.time).slice(0, 5),
    className: c.className,
  }))
})
const dates = computed(() => {
  if (!bookingStore.weekData?.days) return []
  return Object.keys(bookingStore.weekData.days).sort()
})
async function bookSelf(date, slotIndex) {
  const cell = getCell(date, slotIndex)
  if (!cell) return
  await bookingStore.addBooking(authStore.user.id, cell.classId, date)
}
function totalPerClass(slotIndex) {
  if (!bookingStore.weekData?.days) return 0
  return Object.values(bookingStore.weekData.days).reduce((sum, day) => {
    return sum + (day[slotIndex]?.members?.length || 0)
  }, 0)
}
function openBooking(date, slotIndex) {
  const cell = getCell(date, slotIndex)
  if (!cell) return
  selectedClassId.value = cell.classId
  selectedClassName.value = cell.className
  selectedDate.value = date
  showBookingModal.value = true
}

function closeBooking() {
  showBookingModal.value = false
}

function getCell(date, slotIndex) {
  const dayClasses = bookingStore.weekData?.days?.[date]
  if (!dayClasses || !dayClasses[slotIndex]) return null
  return dayClasses[slotIndex]
}

function formatDateLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getDate()}/${d.getMonth() + 1}`
}

const weekLabel = computed(() => {
  if (!bookingStore.weekData) return ''
  return `${bookingStore.weekData.weekStart}  →  ${bookingStore.weekData.weekEnd}`
})
</script>

<template>
  <div class="w-full">
    <!--    Failed to Book Toast-->
    <div v-if="bookingStore.toast"
         class="fixed top-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded shadow-lg">
      {{ bookingStore.toast }}
    </div>
    <!-- Week navigation -->
    <div class="flex items-center justify-center gap-4 mb-4">
      <button
          @click="bookingStore.prevWeek()"
          class="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
      >← Prev</button>
      <span class="text-sm text-gray-300">{{ weekLabel }}</span>
      <button
          @click="bookingStore.nextWeek()"
          class="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
      >Next →</button>
    </div>

    <div v-if="bookingStore.loading" class="text-gray-400 text-center">Loading...</div>
    <div v-else-if="bookingStore.error" class="text-red-400 text-center">{{ bookingStore.error }}</div>

    <div v-else-if="bookingStore.weekData" class="overflow-x-auto">
      <table class="w-full border-collapse text-xs">
        <!-- Header: time slots -->
        <thead>
        <tr>
          <th class="border border-white/20 p-2 bg-white/5"></th>
          <th
              v-for="(slot, i) in timeSlots"
              :key="i"
              class="border border-white/20 p-2 bg-white/5"
          >
            <div class="font-bold">{{ slot.className }}</div>
            <div class="text-gray-400">{{ slot.time }}</div>
          </th>
        </tr>
        </thead>

        <!-- Rows: one per day -->
        <tbody>
        <tr v-for="(date, dayIndex) in dates" :key="date">
          <td class="border border-white/20 p-2 bg-white/5 font-bold whitespace-nowrap">
            {{ DAY_LABELS[dayIndex] }}<br/>
            <span class="text-gray-400 font-normal">{{ formatDateLabel(date) }}</span>
          </td>
          <td
              v-for="(slot, slotIndex) in timeSlots"
              :key="slotIndex"
              class="border border-white/20 p-2 align-top"
          >
            <template v-if="getCell(date, slotIndex)">
              <div class="flex justify-between items-center mb-1">
                <p class="text-purple-400 font-bold">
                  {{ getCell(date, slotIndex).members.length }}/{{ getCell(date, slotIndex).maxCapacity || 20 }}
                </p>
                <button
                    v-if="authStore.user?.role === 'ADMIN'"
                    @click="openBooking(date, slotIndex)"
                    class="text-emerald-400 text-2xl hover:text-purple-400 cursor-pointer"
                >+</button>
                <button
                    v-else-if="authStore.user"
                    @click="bookSelf(date, slotIndex)"
                    class="text-emerald-400 text-2xl hover:text-purple-400 cursor-pointer"
                >+</button>
              </div>
              <div
                  v-for="member in getCell(date, slotIndex).members"
                  :key="member.bookingId"
                  class="flex justify-between items-center leading-tight"
              >
                <span>{{ member.firstName }} {{ member.lastName }}</span>
                <button
                    v-if="authStore.user?.role === 'ADMIN'"
                    @click="bookingStore.deleteBooking(member.bookingId)"
                    class="text-red-500 hover:text-red-400 text-sm ml-2"
                >−</button>
              </div>
            </template>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <BookingModal
        :show="showBookingModal"
        :gym-class-id="selectedClassId"
        :class-name="selectedClassName"
        :date="selectedDate"
        @close="closeBooking"
    />
  </div>
</template>