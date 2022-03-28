import { ref } from 'vue'

let deviceLog = ref([])
const page = ref(1)
const rowsPerPage = ref(10)

export { deviceLog, page, rowsPerPage }
