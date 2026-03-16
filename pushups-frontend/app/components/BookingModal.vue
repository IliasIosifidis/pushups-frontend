<script setup>
import { ref, watch } from 'vue'
import { useMemberStore } from '~/stores/memberStore'
import { useBookingStore } from '~/stores/bookingStore'

const props = defineProps({
  show: { type: Boolean, default: false },
  gymClassId: { type: Number, default: null },
  className: { type: String, default: '' },
  date: { type: String, default: '' },
})

const emit = defineEmits(['close'])

const memberStore = useMemberStore()
const bookingStore = useBookingStore()

const searchQuery = ref('')
const searchResults = ref([])
let searchTimeout = null

function searchMembers() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    if (searchQuery.value.length > 1) {
      await memberStore.searchMembers(searchQuery.value)
      searchResults.value = memberStore.members
    } else {
      searchResults.value = []
    }
  }, 300)
}

async function bookMember(member) {
  await bookingStore.addBooking(member.id, props.gymClassId, props.date)
  searchQuery.value = ''
  searchResults.value = []
  emit('close')
}

watch(() => props.show, (val) => {
  if (!val) {
    searchQuery.value = ''
    searchResults.value = []
  }
})
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/70" @click="emit('close')"></div>

    <div class="relative bg-gray-900 border border-white/20 rounded-lg p-6 w-96">
      <h2 class="text-xl font-bold mb-1">Add Booking</h2>
      <p class="text-sm text-gray-400 mb-4">{{ className }} — {{ date }}</p>

      <input
          v-model="searchQuery"
          @input="searchMembers"
          type="text"
          placeholder="Search member by name..."
          class="w-full bg-white/10 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500 mb-3"
      />

      <div class="max-h-60 overflow-y-auto">
        <div
            v-for="member in searchResults"
            :key="member.id"
            @click="bookMember(member)"
            class="flex justify-between items-center p-2 hover:bg-white/10 rounded cursor-pointer"
        >
          <span>{{ member.firstName }} {{ member.lastName }}</span>
          <span class="text-xs text-purple-400">+ Book</span>
        </div>
        <p v-if="searchQuery.length > 1 && searchResults.length === 0" class="text-gray-500 text-sm">
          No members found
        </p>
      </div>
    </div>
  </div>
</template>