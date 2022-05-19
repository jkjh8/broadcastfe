import { ref } from 'vue'
import { api } from 'boot/axios'

const columns = [
  {
    name: 'createdAt',
    align: 'center',
    label: 'Time',
    field: 'createdAt',
    sortable: true
  },
  {
    name: 'priority',
    align: 'center',
    label: 'Priority',
    field: 'priority',
    sortable: true
  },
  {
    name: 'id',
    align: 'center',
    label: 'ID(User)',
    field: 'id',
    sortable: true
  },
  {
    name: 'zones',
    align: 'center',
    label: 'Zones',
    field: 'zones',
    sortable: true
  },
  { name: 'message', align: 'center', label: 'Message', field: 'message' }
]

let eventlog = ref([])
const page = ref(1)
const rowsPerPage = ref(10)
const totalDocs = ref(0)
const totalPages = ref(0)

const search = ref('')

const getEventLogs = async () => {
  const r = await api.get(
    `eventlog?page=${page.value}&limit=${
      rowsPerPage.value
    }&search=${encodeURIComponent(search.value)}`
  )

  eventlog.value = r.data.docs
  totalPages.value = r.data.totalPages
}

const logLevelColor = (level) => {
  let color
  switch (level) {
    case 1:
    case 4:
      color = 'bg-yellow text-black'
      break
    case 2:
    case 5:
      color = 'bg-red text-white'
      break
    default:
      color = 'bg-white text-black'
  }
  return color
}

export {
  columns,
  eventlog,
  page,
  rowsPerPage,
  totalDocs,
  totalPages,
  search,
  getEventLogs,
  logLevelColor
}
