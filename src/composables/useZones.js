import { ref } from 'vue'
import { api } from 'boot/axios'

const zones = ref([])

async function getZones() {
  const r = await api.get('/zones')
  zones.value = r.data
  console.log(zones.value)
}

export { zones, getZones }
