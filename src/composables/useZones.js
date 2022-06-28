import { ref } from 'vue'
import { api } from 'boot/axios'

const zones = ref([])

async function getZones() {
  const r = await api.get('/zones')
  zones.value = r.data
  console.log(r.data)
}

function childToId(child) {
  const r = []
  for (let i = 0; i < child.length; i++) {
    if (child[i] === null) {
      r.push(null)
    } else {
      r.push(child[i]._id)
    }
  }
  return r
}

export { zones, getZones, childToId }
