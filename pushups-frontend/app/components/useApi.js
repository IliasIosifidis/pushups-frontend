import axios from 'axios'

const api = axios.create({
  baseURL: 'https://pushupsbackend-production.up.railway.app/api',
})

export const useApi = () => api