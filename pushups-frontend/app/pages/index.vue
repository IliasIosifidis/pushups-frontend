<script setup lang="js">

</script>

<template>
  <div class="w-full min-h-screen flex flex-col p-8">
    <div class="grid grid-cols-6 items-center w-full justify-center">
      <div class="relative col-span-1 h-48 overflow-hidden">
        <img
            src="/pushups.jpg"
            class="w-full h-full object-cover object-[30%_70%] opacity-70"
        />
        <!-- Top fade to purple -->
        <div class="absolute inset-0 bg-gradient-to-b from-purple-600 via-transparent to-transparent h-1/8"></div>
        <!-- Bottom fade to black -->
        <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/70 to-transparent h-1/8"></div>
      </div>
      <p class="col-span-1"></p>
      <h1 class="col-span-2 text-8xl text-center">Pushups</h1>
      <p class="col-span-1"></p>
      <p class="col-span-1 text-2xl bg-emerald-300 hover:bg-amber-200 text-black hover:text-gray-700 cursor-pointer rounded-xl text-center">Login</p>
    </div>

    <!-- Top row -->
    <div class="grid grid-cols-6 mt-8 border border-white/20 divide-x divide-white/20">
      <div class="col-span-1 p-4 text-center text-2xl">Classes</div>
      <div class="col-span-4 p-4 text-center text-2xl">Booking</div>
      <div class="col-span-1 p-4 text-center text-2xl">Members</div>
    </div>

    <!-- Bottom row -->
    <div class="grid grid-cols-6 flex-1 border border-t-0 border-white/20 divide-x divide-white/20">
      <div class="col-span-1 p-4 text-center">Classes List</div>
      <div class="col-span-4 p-4 text-center">Calendar</div>
      <div class="col-span-1 p-4 text-center"><MemberList /></div>
    </div>
  </div>
</template>

<style scoped>

</style>