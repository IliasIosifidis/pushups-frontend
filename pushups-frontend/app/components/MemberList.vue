<script setup>
import { ref, onMounted } from 'vue'
import { useMemberStore } from '~/stores/memberStore'

const memberStore = useMemberStore()

onMounted(() => {
  memberStore.fetchActiveMembers()
})

const showModal = ref(false)
const selectedMember = ref(null)
const searchQuery = ref('')
let searchTimeout = null

function searchMembers() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.length > 1) {
      memberStore.searchMembers(searchQuery.value)
    } else {
      memberStore.fetchActiveMembers()
    }
  }, 300)
}

const editMember = (member) => {
  selectedMember.value = member
  showModal.value = true
}

const addMember = () => {
  selectedMember.value = null
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedMember.value = null
}
</script>

<template>
  <div>
    <button
        class="text-xs bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded mr-3"
        @click="addMember">+ Add Member
    </button>
    <input
        v-model="searchQuery"
        @input="searchMembers"
        type="text"
        placeholder="Search by name..."
        class="text-xs bg-gray-700 text-white px-3 py-1 rounded outline-none focus:ring-1 focus:ring-purple-500"
    />

    <div v-if="memberStore.loading" class="text-gray-400">Loading...</div>
    <div v-else-if="memberStore.error" class="text-red-400">{{ memberStore.error }}</div>

    <div v-for="member in memberStore.members" :key="member.id" class="group flex justify-between items-center cursor-pointer">
      <div class="">
        <p class="font-semibold text-left">{{ member.firstName }} {{ member.lastName }}</p>
        <p class="text-sm text-left text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-1 hidden group-hover:block">
          {{ member.phoneNumber }}
        </p>
      </div>
      <div class="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button class="text-xs bg-yellow-500/80 hover:bg-yellow-500 px-2 py-1 rounded"
            @click="editMember(member)">Edit
        </button>
        <button class="text-xs bg-indigo-500/80 hover:bg-indigo-500 px-2 py-1 rounded"
            @click="memberStore.toggleActive(member.id)">Deactivate
        </button>
      </div>
    </div>

    <div class="flex gap-2 items-center">
      <button
          @click="memberStore.prevPage()"
          :disabled="memberStore.currentPage === 0"
          class="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded disabled:opacity-30"
      >← Prev</button>

      <span class="text-xs text-gray-400">
        Page {{ memberStore.currentPage + 1 }} of {{ memberStore.totalPages }}
    </span>

      <button
          @click="memberStore.nextPage()"
          :disabled="memberStore.currentPage >= memberStore.totalPages - 1"
          class="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded disabled:opacity-30"
      >Next →</button>
    </div>

    <MemberModal
        :show="showModal"
        :member="selectedMember"
        @close="closeModal"
    />
  </div>
</template>