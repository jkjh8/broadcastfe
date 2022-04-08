import { ref } from 'vue'

let devices = ref([])
let state = ref([])

const columns = [
  {
    name: 'index',
    align: 'center',
    label: 'ID',
    field: 'index',
    sortable: true
  },
  {
    name: 'name',
    align: 'center',
    label: 'Name',
    field: 'name',
    sortable: true
  },
  {
    name: 'ipaddress',
    align: 'center',
    label: 'IP Address',
    field: 'ipaddress',
    sortable: true
  },
  {
    name: 'deviceType',
    align: 'center',
    label: 'Device Type',
    field: 'deviceType',
    sortable: true
  },
  {
    name: 'mode',
    align: 'center',
    label: 'Active Mode',
    field: 'mode',
    sortable: true
  },
  { name: 'actions', align: 'center', label: 'Actions' }
]

export { devices, state, columns }