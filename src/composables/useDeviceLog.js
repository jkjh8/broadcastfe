import { ref } from 'vue'

let deviceLog = ref([])
const page = ref(1)
const rowsPerPage = ref(10)
const totalDocs = ref(0)
const totalPages = ref(0)

export { deviceLog, page, rowsPerPage, totalDocs, totalPages }
