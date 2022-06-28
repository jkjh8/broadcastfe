<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
// import { socket } from 'boot/socketio'
import {
  devices,
  status,
  columns,
  getDevices,
  getStatus,
  getPa
} from 'composables/useDevices'

import PageName from 'components/layout/pageName.vue'
import DialogInfo from 'components/dialogs/devices/info'
import DialogAdd from 'components/dialogs/devices/add.vue'
import Confirm from 'components/dialogs/confirm'
import IconBtn from 'components/iconBtn'

import useNotify from 'composables/useNotify'
const { notifyError } = useNotify()
let timer = ref(null)

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

function fnGetInfo(item) {
  $q.dialog({
    component: DialogInfo,
    componentProps: { item: item }
  })
}

function fnAdd(item) {
  $q.dialog({
    component: DialogAdd,
    componentProps: { item: item }
  }).onOk(async (device) => {
    $q.loading.show()
    try {
      if (device._id) {
        await api.put('/device', { _id: item._id, ...device })
      } else {
        await api.post('/device', device)
      }
      getDevices()
      $q.loading.hide()
    } catch (err) {
      $q.loading.hide()
      notifyError({
        message: '디바이스 추가(수정) 중 오류가 발생하였습니다.'
      })
      console.error(err)
    }
  })
}

function fnDelete(item) {
  $q.dialog({
    component: Confirm,
    componentProps: {
      icon: 'delete',
      iconColor: 'red-10',
      title: '디바이스 삭제',
      caption: `${item.name} 선택된 디바이스를 삭제 합니다.`
    }
  }).onOk(async () => {
    $q.loading.show()
    try {
      await api.get(
        `/device/delete?id=${item._id}&name=${item.name}&ipaddress=${item.ipaddress}`
      )
      getDevices()
      $q.loading.hide()
    } catch (err) {
      $q.loading.hide()
      notifyError({
        message: '디바이스 삭제 중 오류가 발생하였습니다.'
      })
      console.error(err)
    }
  })
}

async function fnRefreshDevice(item) {
  $q.loading.show()
  try {
    await api.post('/device/refresh', item)
    $q.loading.hide()
  } catch (err) {
    $q.loading.hide()
    console.error(err)
  }
}

async function fnRefreshAll() {
  $q.loading.show()
  try {
    await api.get('/device/refreshall')
    $q.loading.hide()
  } catch (err) {
    $q.loading.hide()
    console.error(err)
  }
}

onMounted(() => {
  getDevices()
  getStatus()
  timer.value = setInterval(() => {
    getStatus()
    getPa()
  }, 10000)
})

onUnmounted(() => {
  clearInterval(timer.value)
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
      <IconBtn
        name="add_circle"
        color="green-10"
        size="30px"
        msg="하드웨어추가"
        @click="fnAdd()"
      />
      <IconBtn
        name="refresh"
        color="green-10"
        size="30px"
        msg="새로고침"
        @click="fnRefreshAll()"
      />
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
      <!-- Table Header -->
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
      <!-- Table Body -->
      <template #body="props">
        <q-tr :props="props">
          <q-td key="index" :props="props">
            <q-avatar size="28px">
              {{ props.row.index }}
              <div v-if="props.row.mode !== 'Local'">
                <q-badge
                  v-if="status && status[props.row.ipaddress] === 'true'"
                  color="green"
                  rounded
                  floating
                />
                <q-badge v-else color="red-10" rounded floating />
              </div>
            </q-avatar>
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="ipaddress" :props="props">
            <a :href="`http://${props.row.ipaddress}`" target="_blank">
              {{ props.row.ipaddress }}
            </a>
          </q-td>
          <q-td key="deviceType" :props="props">
            {{ props.row.deviceType.toUpperCase() }}
          </q-td>
          <q-td key="mode" :props="props">
            {{ props.row.mode }}
          </q-td>
          <q-td key="actions" :props="props" class="q-gutter-x-sm">
            <IconBtn
              name="info"
              size="xs"
              color="grey"
              msg="상세정보"
              @click="fnGetInfo(props.row)"
            />
            <IconBtn
              name="edit"
              size="xs"
              msg="수정"
              @click="fnAdd(props.row)"
            />
            <IconBtn
              name="delete"
              size="xs"
              color="red-10"
              msg="삭제"
              @click="fnDelete(props.row)"
            />
            <IconBtn
              name="refresh"
              size="xs"
              msg="새로고침"
              @click="fnRefreshDevice(props.row)"
            />
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
