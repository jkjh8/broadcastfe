import { ref } from 'vue'

const user = ref(null)
const updateUser = (args) => {
  user = args
}
export { user, updateUser }
