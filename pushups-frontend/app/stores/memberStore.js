import { defineStore } from 'pinia'
import {useApi} from "~/pagescomposables/useApi.js";

export const useMemberStore = defineStore('members', {
  state: () => ({
    members: [],
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 20,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchActiveMembers(page = 0, size = 20) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const { data } = await api.get('/member/active', {
          params: { page, size },
        })
        this.members = data.content
        this.totalElements = data.page.totalElements
        this.totalPages = data.page.totalPages
        this.currentPage = data.page.number
        this.pageSize = data.page.size
      } catch (e) {
        this.error = e.response?.data?.message || 'Failed to fetch members'
      } finally {
        this.loading = false
      }
    },

    async prevPage() {
      if (this.currentPage > 0) {
        await this.fetchActiveMembers(this.currentPage - 1)
      }
    },

    async nextPage() {
      if (this.currentPage < this.totalPages){
        await this.fetchActiveMembers(this.currentPage + 1)
      }
    },

    async createMember(member) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const { data } = await api.post('/member', member)
        await this.fetchActiveMembers(this.currentPage, this.pageSize)
        return data
      } catch (e) {
        this.error = e.response?.data?.message || 'Failed to create member'
        throw e
      } finally {
        this.loading = false
      }
    },

    async updateMember(id, member) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const { data } = await api.put(`/member/${id}`, member)
        await this.fetchActiveMembers(this.currentPage, this.pageSize)
        return data
      } catch (e) {
        this.error = e.response?.data?.message || 'Failed to update member'
        throw e
      } finally {
        this.loading = false
      }
    },
    async toggleActive(id){
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        await api.patch(`/member/${id}`)
        await this.fetchActiveMembers(this.currentPage, this.pageSize)
      } catch (e){
        this.error = e.response?.data?.message || 'Failed to activate/ deactivate this member'
      } finally {
        this.loading = false
      }
    },

    async deleteMember(id) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        await api.delete(`/member/${id}`)
        await this.fetchActiveMembers(this.currentPage, this.pageSize)
      } catch (e) {
        this.error = e.response?.data?.message || 'Failed to delete member'
        throw e
      } finally {
        this.loading = false
      }
    },

    async searchMembers(query, page = 0, size = 20) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const { data } = await api.get('/member/search', {
          params: { name:query, page, size },
        })
        this.members = data.content
        this.totalElements = data.page.totalElements
        this.totalPages = data.page.totalPages
        this.currentPage = data.page.number
        this.pageSize = data.page.size
      } catch (e) {
        this.error = e.response?.data?.message || 'Failed to search members'
      } finally {
        this.loading = false
      }
    },
  },
})