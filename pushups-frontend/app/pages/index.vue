<script setup lang="js">
import { useAuthStore } from '~/stores/authStore'

const authStore = useAuthStore()
authStore.fetchUser()
</script>

<template>
  <div class="w-full min-h-screen flex flex-col p-8">
    <div class="grid grid-cols-6 items-end w-full justify-center gap-24">
      <p class="col-span-1"></p>
      <div class="relative col-span-4 h-102">
        <img
            src="/MainLogo.png"
            class="w-full h-full "
        />
      </div>
      <div class="col-span-1 text-center">
        <a v-if="!authStore.user"
           href="https://pushupsbackend-production.up.railway.app/oauth2/authorization/google"
           class="text-md bg-emerald-300 hover:bg-amber-200 text-black hover:text-gray-700 cursor-pointer rounded-xl px-4 py-1">
          Login
        </a>
        <div v-else class="flex flex-col gap-2">
          <div class="flex gap-2">
            <p class="text-md"> 🙋‍♂️ {{ authStore.user.firstName }} -</p>
            <p class="text-md text-gray-300 "> {{ authStore.user.role }}</p>
          </div>
          <button @click="authStore.toggleRole()" class="bg-emerald-300 hover:bg-amber-200 text-black hover:text-gray-700 cursor-pointer rounded-xl px-4">Toggle Role</button>
          <button @click="authStore.logout()" class="bg-red-400 hover:bg-red-500 text-black hover:text-gray-700 cursor-pointer rounded-xl px-4">Logout</button>
        </div>
      </div>
    </div>

    <!-- Top row -->
    <div class="grid grid-cols-6 mt-8 border border-white/20 divide-x divide-white/20">
      <div class="col-span-1 p-4 text-center text-2xl">Classes</div>
      <div class="col-span-4 p-4 text-center text-2xl">Booking</div>
      <div class="col-span-1 p-4 text-center text-2xl">Members</div>
    </div>

    <!-- Bottom row -->
    <div class="grid grid-cols-6 flex-1 border border-t-0 border-white/20 divide-x divide-white/20">
      <div class="col-span-1 p-4 text-center"><ClassList /></div>
      <div class="col-span-4 p-4 text-center"><WeeklyCalendar /></div>
      <div class="col-span-1 p-4 text-center">
        <div class="col-span-1 p-4 text-center">
          <MemberList v-if="authStore.user?.role === 'ADMIN'" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>