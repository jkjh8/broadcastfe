import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: `http://${window.location.hostname}:3000/api`
})
const apis = axios.create({
  baseURL: `https://${window.location.hostname}:3443/api`
})

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  app.config.globalProperties.$apis = apis
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api, apis }
