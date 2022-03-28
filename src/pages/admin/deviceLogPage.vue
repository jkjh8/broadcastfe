<script setup>
import { onMounted, ref } from 'vue'
import { api } from '@/boot/axios'
import { deviceLog, page, rowsPerPage } from '@/composables/useDeviceLog'

const search = ref('')

async function getDeviceLogs() {
  const r = await api.get(
    `/admin/devicelog?page=${page.value}&limit=${
      rowsPerPage.value
    }&search=${encodeURIComponent(search.value)}`
  )
  deviceLog.value = r.data.docs
}

onMounted(() => {
  getDeviceLogs()
})

const columns = [
  {
    name: 'timestamp',
    align: 'center',
    label: 'Time',
    field: 'timestamp',
    sortable: true
  },
  {
    name: 'level',
    align: 'center',
    label: 'Level',
    field: 'level',
    sortable: true
  },
  { name: 'message', align: 'center', label: 'Message', field: 'message' }
]
</script>

<template>
  <div>
    <div>관리자 로그</div>
  </div>
  <div class="q-pa-sm">
    <q-table
      :rows="deviceLog"
      :columns="columns"
      flat
      :pagination="{ page, rowsPerPage }"
    ></q-table>
  </div>
</template>
