<script setup>
import { ref, watch } from 'vue'
import { useMemberStore } from '~/stores/memberStore'

const props = defineProps({
  member: { type: Object, default: null },
  show: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const memberStore = useMemberStore()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
})

watch(() => props.show, (val) => {
  if (val && props.member) {
    form.value = { ...props.member }
  } else if (val) {
    form.value = { firstName: '', lastName: '', email: '', phone: '' }
  }
})

const isEdit = () => !!props.member

const save = async () => {
  try {
    if (isEdit()) {
      await memberStore.updateMember(props.member.id, form.value)
    } else {
      await memberStore.createMember(form.value)
    }
    emit('close')
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/70" @click="emit('close')"></div>

    <!-- Modal -->
    <div class="relative bg-gray-900 border border-white/20 rounded-lg p-6 w-96">
      <h2 class="text-xl font-bold mb-4">
        {{ isEdit() ? 'Edit Member' : 'New Member' }}
      </h2>

      <div class="flex flex-col gap-3">
        <input
            v-model="form.firstName"
            placeholder="First Name"
            class="bg-white/10 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
            v-model="form.lastName"
            placeholder="Last Name"
            class="bg-white/10 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
            v-model="form.email"
            placeholder="Email"
            class="bg-white/10 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
            v-model="form.phone"
            placeholder="Phone"
            class="bg-white/10 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button
            class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition"
            @click="emit('close')"
        >
          Cancel
        </button>
        <button
            class="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded transition"
            @click="save"
        >
          {{ isEdit() ? 'Update' : 'Create' }}
        </button>
      </div>
    </div>
  </div>
</template>