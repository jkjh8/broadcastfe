<script setup>
import { onBeforeMount, ref } from 'vue'
import moment from 'moment'
import { api } from '@/boot/axios'
import PageName from '@/components/layout/pageName'

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

moment.locale('ko')

let eventlog = ref([])
const page = ref(1)
const rowsPerPage = ref(10)
const totalDocs = ref(0)
const totalPages = ref(0)

const search = ref('')

async function getEventLogs() {
  const r = await api.get(
    `/eventlog?page=${page.value}&limit=${
      rowsPerPage.value
    }&search=${encodeURIComponent(search.value)}`
  )
  eventlog.value = r.data.docs
  totalPages.value = r.data.totalPages
}

function logLevelColor(level) {
  let color
  switch (level) {
    case 'warn':
    case 'admin_warn':
      color = 'bg-yellow text-black'
      break
    case 'error':
    case 'admin_error':
      color = 'bg-red text-white'
      break
    default:
      color = 'bg-white text-black'
  }
  return color
}

onBeforeMount(() => {
  getEventLogs()
})
</script>

<template>
  <div class="row justify-between items-center">
    <PageName
      name="이벤트 로그"
      caption="이벤트 로그 및 방송 기록"
      icon="svguse:icons.svg#serverColorInfo"
    />
    <div>
      <q-input
        v-model="search"
        filled
        dense
        clearable
        label="Search"
        @keyup.enter="getEventLogs"
        @clear="getEventLogs"
      >
        <template #append>
          <q-icon style="cursor: pointer" name="search" @click="getEventLogs" />
        </template>
      </q-input>
    </div>
  </div>

  <!-- Tabel -->
  <div class="bord">
    <q-table
      style="border-radius: 0.5rem"
      :rows="eventlog"
      :columns="columns"
      flat
      wrap-cells
      hide-pagination
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
          <q-td key="createdAt" :props="props">
            {{ moment(props.row.createdAt).format('YYYY-MM-DD hh:mm:ss a') }}
          </q-td>
          <q-td key="priority" :props="props">
            {{ props.row.priority.toUpperCase() }}
          </q-td>
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="zones" :props="props">
            {{ props.row.zones.join(',') }}
          </q-td>
          <q-td key="message" :props="props" style="max-width: 800px">
            <div>
              {{ props.row.message }}
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <div class="q-mt-md row justify-center">
    <q-pagination
      v-model="page"
      :max="totalPages"
      :max-pages="10"
      direction-links
      boundary-links
      @update:model-value="getEventLogs"
    />
  </div>
</template>
