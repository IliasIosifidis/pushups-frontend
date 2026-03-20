import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
  }),

  actions: {
    async fetchUser() {
      this.loading = true
      try {
        const api = useApi()
        const { data } = await api.get('/auth/me', { withCredentials: true })
        this.user = data
      } catch (e) {
        this.user = null
      } finally {
        this.loading = false
      }
    },

    async toggleRole() {
      if (!this.user) return
      try {
        const api = useApi()
        await api.put(`/auth/demo/${this.user.id}/toggle-role`, null, { withCredentials: true })
        await this.fetchUser()
      } catch (e) {
        console.error('Failed to toggle role', e)
      }
    },

    logout() {
      this.user = null
      window.location.href = 'https://pushupsbackend-production.up.railway.app/logout'
    },
  },
})