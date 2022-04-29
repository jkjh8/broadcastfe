import { ref } from 'vue'
import { api } from 'boot/axios'

let devices = ref([])
let state = ref([])
let sender = ref([])
let reciver = ref([])

async function getDevices() {
  const r = await api.get('device')
  devices.value = r.data
  sortDevices(r.data)
  // console.log(r.data)
}

function sortDevices(args) {
  sender.value = []
  reciver.value = []
  for (let i = 0; i < args.length; i++) {
    if (args[i].deviceType === 'Q-Sys' && args[i].mode !== 'Local') {
      sender.value.push(args[i])
    } else {
      if (args[i].mode === 'Send') {
        sender.value.push(args[i])
      } else {
        reciver.value.push(args[i])
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

export { devices, state, sender, reciver, columns, getDevices }
