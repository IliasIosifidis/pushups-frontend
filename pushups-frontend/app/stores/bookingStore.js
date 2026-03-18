import { defineStore } from 'pinia'
import { useApi } from '~/pagescomposables/useApi.js'

export const useBookingStore = defineStore('bookings', {
  state: () => ({
    weekData: null,
    weekStart: null,
    loading: false,
    error: null,
    toast: null,
  }),

  actions: {
    getMonday(date) {
      const d = new Date(date)
      const day = d.getDay()
      const diff = d.getDate() - day + (day === 0 ? -6 : 1)
      return new Date(d.setDate(diff))
    },

    formatDate(date) {
      return date.toISOString().split('T')[0]
    },

    async fetchWeek(date) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const { data } = await api.get('/booking/weekly', {
          params: { date: this.formatDate(date) },
        })
        this.weekData = data
        this.weekStart = new Date(data.weekStart)
      } catch (e) {
        this.error = e.response?.data?.message || 'Failed to fetch weekly bookings'
      } finally {
        this.loading = false
      }
    },

    async loadCurrentWeek() {
      const monday = this.getMonday(new Date())
      await this.fetchWeek(monday)
    },

    async nextWeek() {
      const next = new Date(this.weekStart)
      next.setDate(next.getDate() + 7)
      await this.fetchWeek(next)
    },

    async prevWeek() {
      const prev = new Date(this.weekStart)
      prev.setDate(prev.getDate() - 7)
      await this.fetchWeek(prev)
    },
    async addBooking(memberId, gymClassId, date) {
      try {
        const api = useApi()
        await api.post('/booking', { memberId, gymClassId, date })
        await this.fetchWeek(this.weekStart)
      } catch (e) {
        this.toast = e.response?.data?.message || 'Failed to add booking'
        setTimeout(() => { this.toast = null }, 3000)
      }
    },
    async deleteBooking(bookingId) {
      try {
        const api = useApi()
        await api.delete(`/booking/${bookingId}`)
        await this.fetchWeek(this.weekStart)
      } catch (e) {
        this.error = e.response?.data?.message || 'Failed to delete booking'
      }
    },
  },
})