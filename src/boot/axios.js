import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({
  baseURL: `http://${window.location.hostname}:3000/api`,
  withCredentials: true
})

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
