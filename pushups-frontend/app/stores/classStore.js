import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi.js'

const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']

export const useClassStore = defineStore('classes', {
  state: () => ({
    classes: [],
    currentDay: DAYS[new Date().getDay()],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchDailyClasses(dayOfWeek) {
      if (dayOfWeek) this.currentDay = dayOfWeek
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const { data } = await api.get('/class/daily', {
          params: { dayOfWeek: this.currentDay },
        })
        this.classes = data
      } catch (e) {
        this.error = e.response?.data?.message || 'Failed to fetch classes'
      } finally {
        this.loading = false
      }
    },
  },
})