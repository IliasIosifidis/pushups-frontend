<script setup>
import { useMemberStore } from '~/stores/memberStore'

const memberStore = useMemberStore()

await memberStore.fetchMembers()
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl mb-6">Members</h1>

    <p v-if="memberStore.loading" class="text-gray-400">Loading...</p>
    <p v-else-if="memberStore.error" class="text-red-400">{{ memberStore.error }}</p>

    <div v-else class="grid gap-4">
      <div
          v-for="member in memberStore.members"
          :key="member.id"
          class="bg-white/10 rounded-lg p-4 flex justify-between items-center"
      >
        <div>
          <p class="text-lg font-semibold">{{ member.firstName }} {{ member.lastName }}</p>
<!--          <p class="text-sm text-gray-400">{{ member.email }}</p>-->
        </div>
        <span class="text-xs bg-purple-600/50 px-3 py-1 rounded-full">
<!--          {{ member.membershipType }}-->
        </span>
      </div>

       Pagination
      <div class="flex justify-center gap-4 mt-6">
        <button
            :disabled="memberStore.currentPage === 0"
            class="px-4 py-2 bg-white/10 rounded disabled:opacity-30"
            @click="memberStore.fetchMembers(memberStore.currentPage - 1)"
        >
          Previous
        </button>
        <span class="py-2 text-gray-400">
          Page {{ memberStore.currentPage + 1 }} of {{ memberStore.totalPages }}
        </span>
        <button
            :disabled="memberStore.currentPage + 1 >= memberStore.totalPages"
            class="px-4 py-2 bg-white/10 rounded disabled:opacity-30"
            @click="memberStore.fetchMembers(memberStore.currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>