<script setup>
import { ref, onMounted } from 'vue'
import { useMemberStore } from '~/stores/memberStore'

const memberStore = useMemberStore()

onMounted(() => {
  memberStore.fetchMembers()
})

const showModal = ref(false)
const selectedMember = ref(null)

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
        class="text-xs bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded mb-3"
        @click="addMember"
    >
      + Add Member
    </button>

    <div v-if="memberStore.loading" class="text-gray-400">Loading...</div>
    <div v-else-if="memberStore.error" class="text-red-400">{{ memberStore.error }}</div>

    <div v-for="member in memberStore.members" :key="member.id" class="group flex justify-between items-center">
      <div>
        <p class="font-semibold">{{ member.firstName }} {{ member.lastName }}</p>
        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {{ member.phoneNumber }}
        </p>
      </div>
      <div class="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
            class="text-xs bg-yellow-500/80 hover:bg-yellow-500 px-2 py-1 rounded"
            @click="editMember(member)"
        >
          Edit
        </button>
        <button
            class="text-xs bg-red-500/80 hover:bg-red-500 px-2 py-1 rounded"
            @click="memberStore.deleteMember(member.id)"
        >
          Delete
        </button>
      </div>
    </div>

    <MemberModal
        :show="showModal"
        :member="selectedMember"
        @close="closeModal"
    />
  </div>
</template>