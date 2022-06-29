import { ref } from 'vue'
import { api } from 'boot/axios'
import { receiver } from './useDevices'

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

function chkNetworkChannel(v, core, children) {
  const networkChannels = 32
  if (!v) return true
  if (core.model !== '510i') {
    networkChannels = 4
  }

  for (let i = 0; i < children.length; i++) {
    if (i > networkChannels) {
      if (children[i].mode !== 'Local') {
        return '사용할 수 있는 네트워크 채널을 초과 했습니다.'
      }
    }
  }
  return true
}

export { zones, getZones, childToId }
