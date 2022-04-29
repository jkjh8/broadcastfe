<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { getDevices } from 'composables/useDevices'

import useNotify from 'composables/useNotify'

import PageName from 'components/layout/pageName.vue'
import DialogInfo from 'components/dialogs/devices/info'
import DialogAdd from 'components/dialogs/zones/add.vue'
import Confirm from 'components/dialogs/confirm'

const columns = [
  {
    name: 'index',
    align: 'center',
    label: 'Index',
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
    name: 'core',
    align: 'center',
    label: 'Core',
    field: 'core',
    sortable: true
  },
  {
    name: 'channels',
    align: 'center',
    label: 'Channels',
    field: 'channels',
    sortable: true
  },
  { name: 'actions', align: 'center', label: 'Actions' }
]

const zones = ref([])
const { notifyError } = useNotify()

const $q = useQuasar()
const search = ref('')
const initPagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10
})

const totalPages = computed(() => {
  return Math.ceil(zones.value.length / initPagination.value.rowsPerPage)
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
        message: '디바이스 추가(수정) 중 오류가 발생하였습니다.',
        caption:
          '잠시후에 다시 시도해 주세요. 오류가 계속되면 관리자에게 문의 해주세요.'
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
      caption: '선택된 디바이스를 삭제 합니다.',
      message: `${item.name}를 삭제 하시겠습니까?`
    }
  }).onOk(async () => {
    $q.loading.show()
    try {
      await api.get(`/device/delete?id=${item._id}`)
      getDevices()
      $q.loading.hide()
    } catch (err) {
      $q.loading.hide()
      notifyError({
        message: '디바이스 추가(수정) 중 오류가 발생하였습니다.',
        caption:
          '잠시후에 다시 시도해 주세요. 오류가 계속되면 관리자에게 문의 해주세요.'
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
    console.log(await api.get('/device/refreshall'))
    $q.loading.hide()
  } catch (err) {
    $q.loading.hide()
    console.error(err)
  }
}

onMounted(() => {
  getDevices()
})
</script>

<template>
  <div class="row justify-between items-center">
    <PageName
      name="방송구간 관리"
      caption="방송구간 등록 삭제 및 관리"
      icon="svguse:icons.svg#mapColor"
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
      <q-icon
        style="cursor: pointer"
        name="refresh"
        color="green-10"
        size="30px"
        @click="fnRefreshAll()"
      ></q-icon>
    </div>
  </div>

  <!-- Table -->
  <div class="bord">
    <q-table
      style="border-radius: 0.5rem"
      :rows="zones"
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
            <q-avatar size="28px">
              {{ props.row.index }}
              <q-badge v-if="props.row.status" color="green" rounded floating />
              <q-badge v-else color="red-10" rounded floating />
            </q-avatar>
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
            <q-btn
              round
              flat
              icon="info"
              size="sm"
              color="grey"
              @click="fnGetInfo(props.row)"
            >
              <q-tooltip
                class="tooltip-bg"
                anchor="top middle"
                self="bottom middle"
                :offset="[10, 10]"
              >
                상세정보
              </q-tooltip>
            </q-btn>
            <q-btn
              round
              flat
              icon="edit"
              size="sm"
              color="primary"
              @click="fnAdd(props.row)"
            >
              <q-tooltip
                class="tooltip-bg"
                anchor="top middle"
                self="bottom middle"
                :offset="[10, 10]"
              >
                수정
              </q-tooltip>
            </q-btn>
            <q-btn
              round
              flat
              icon="delete"
              size="sm"
              color="red-10"
              @click="fnDelete(props.row)"
            >
              <q-tooltip
                class="tooltip-bg"
                anchor="top middle"
                self="bottom middle"
                :offset="[10, 10]"
              >
                삭제
              </q-tooltip>
            </q-btn>
            <q-btn
              round
              flat
              icon="refresh"
              size="sm"
              color="green-10"
              @click="fnRefreshDevice(props.row)"
            >
              <q-tooltip
                class="tooltip-bg"
                anchor="top middle"
                self="bottom middle"
                :offset="[10, 10]"
              >
                새로고침
              </q-tooltip>
            </q-btn>
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
