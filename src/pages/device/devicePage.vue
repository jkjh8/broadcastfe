<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { devices, columns, getDevices } from 'composables/useDevices'

import PageName from 'components/layout/pageName.vue'
import DialogAdd from 'components/dialogs/devices/add.vue'
import Confirm from 'components/dialogs/confirm'

const $q = useQuasar()
const search = ref('')
const initPagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10
})

const totalPages = computed(() => {
  return Math.ceil(devices.value.length / initPagination.value.rowsPerPage)
})

function fnAdd(item) {
  $q.dialog({
    component: DialogAdd,
    componentProps: item
  }).onOk(async (device) => {
    await api.post('/devices', device)
    getDevices()
  })
}

function fnDelete(item) {
  $q.dialog({
    component
  })
}

onMounted(() => {
  getDevices()
})
</script>

<template>
  <div class="row justify-between items-center">
    <PageName
      name="장치 관리"
      caption="하드웨어 등록 삭제 및 관리"
      icon="svguse:icons.svg#serverColorPlus"
    />
    <div class="row no-wrap items-center q-gutter-x-md">
      <q-input v-model="search" filled dense clearable label="Search">
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-separator vertical />
      <q-icon
        style="cursor: pointer"
        name="add_circle"
        color="green-10"
        size="30px"
        @click="fnAdd()"
      ></q-icon>
    </div>
  </div>

  <!-- Table -->
  <div class="bord">
    <q-table
      style="border-radius: 0.5rem"
      :rows="devices"
      :columns="columns"
      flat
      wrap-cells
      hide-pagination
      :pagination="initPagination"
      :filter="search"
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
        <q-tr :props="props">
          <q-td key="index" :props="props">
            {{ props.row.index }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="ipaddress" :props="props">
            {{ props.row.ipaddress }}
          </q-td>
          <q-td key="deviceType" :props="props">
            {{ props.row.deviceType }}
          </q-td>
          <q-td key="mode" :props="props">
            {{ props.row.mode }}
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn round flat icon="delete" size="sm" color="red-10" />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <div class="q-mt-md row justify-center">
    <q-pagination
      v-model="initPagination.page"
      :max="totalPages"
      :max-pages="10"
      direction-links
      boundary-links
    />
  </div>
</template>
