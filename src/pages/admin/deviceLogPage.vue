<script setup>
import { onMounted, ref } from 'vue'
import moment from 'moment'
import { api } from '@/boot/axios'
import {
  deviceLog,
  page,
  rowsPerPage,
  totalPages
} from '@/composables/useDeviceLog'

const search = ref('')

async function getDeviceLogs() {
  const r = await api.get(
    `/admin/devicelog?page=${page.value}&limit=${
      rowsPerPage.value
    }&search=${encodeURIComponent(search.value)}`
  )
  console.log(r)
  deviceLog.value = r.data.docs
  totalPages.value = r.data.totalPages
}

function logLevelColor(level) {
  if (level === 'warn') {
    return 'bg-yellow'
  } else if (level === 'error') {
    return 'bg-red'
  } else {
    return 'bg-white'
  }
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
  <div class="row justify-between items-center">
    <div>
      <q-item>
        <q-item-section avatar>
          <q-icon name="svguse:icons.svg#serverColor" size="md" />
        </q-item-section>
        <q-item-section>
          <q-item-label> 관리자 로그 </q-item-label>
          <q-item-label caption
            >하드웨어 로그 및 시스템 관리자 등급 로그</q-item-label
          >
        </q-item-section>
      </q-item>
    </div>
    <div>
      <q-input
        v-model="search"
        filled
        dense
        clearable
        label="Search"
        @keyup.enter="getDeviceLogs"
        @clear="getDeviceLogs"
      >
        <template #append>
          <q-icon
            style="cursor: pointer"
            name="search"
            @click="getDeviceLogs"
          />
        </template>
      </q-input>
    </div>
  </div>
  <div class="bord">
    <q-table
      style="border-radius: 0.5rem"
      :rows="deviceLog"
      :columns="columns"
      flat
      :pagination="{ page, rowsPerPage }"
    >
      <template #header="props">
        <q-tr class="bg-grey-1" :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-h6 text-bold"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template #body="props">
        <q-tr :props="props" :class="logLevelColor(props.row.level)">
          <q-td key="timestamp" :props="props">
            {{ moment(props.row.timestamp).format('YYYY-MM-DD hh:mm:ss a') }}
          </q-td>
          <q-td key="level" :props="props">
            {{ props.row.level }}
          </q-td>
          <q-td key="message" :props="props">
            {{ props.row.message }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <div class="q-mt-md row justify-center">
    <q-pagination
      v-model="page"
      :max="totalPages"
      direction-links
      boundary-links
      @update:model-value="getDeviceLogs"
    />
  </div>
</template>

<style scoped>
.bord {
  margin-top: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}
</style>
