import axios from 'axios'

const api = axios.create({
  baseURL: 'https://pushupsbackend-production.up.railway.app/api',
  // baseURL: 'http://localhost:8080/api',
  withCredentials : true,
})

export const useApi = () => api