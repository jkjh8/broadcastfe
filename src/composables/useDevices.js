import { ref } from 'vue'
import { api } from 'boot/axios'

let pa = ref(null)
let devices = ref([])
let status = ref(null)
let state = ref([])
let sender = ref([])
let receiver = ref([])

async function getDevices() {
  const r = await api.get('/device')
  devices.value = r.data
  sortDevices(r.data)
  // console.log(r.data)
}

async function getStatus() {
  const r = await api.get('/device/status')
  status.value = r.data
  // console.log(status.value)
}

async function getPa() {
  const r = await api.get('/device/pa')
  const _pa = {}
  for (const key in r.data) {
    _pa[key] = JSON.parse(r.data[key])
  }
  pa.value = _pa
}

function sortDevices(args) {
  sender.value = []
  receiver.value = []
  for (let i = 0; i < args.length; i++) {
    if (args[i].deviceType === 'Q-Sys' && args[i].mode !== 'Local') {
      sender.value.push(args[i])
    } else {
      if (args[i].mode === 'Send') {
        sender.value.push(args[i])
      } else {
        receiver.value.push(args[i])
      }
    }
  }
}

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

export {
  pa,
  devices,
  status,
  state,
  sender,
  receiver,
  columns,
  getDevices,
  getStatus,
  getPa
}
