<script setup>
import { onBeforeMount, ref } from 'vue'
import { useQuasar } from 'quasar'
import moment from 'moment'
import { api } from '@/boot/axios'
import { user } from 'composables/useAuth'
import {
  columns,
  eventlog,
  page,
  rowsPerPage,
  totalDocs,
  totalPages,
  search,
  getEventLogs,
  logLevelColor
} from 'composables/useLogs'

import PageName from '@/components/layout/pageName'
import IconBtn from 'src/components/iconBtn.vue'

import Confirm from 'components/dialogs/confirm'

moment.locale('ko')
const $q = useQuasar()

function fnDeleteAll() {
  $q.dialog({
    component: Confirm,
    componentProps: {
      icon: 'delete',
      iconColor: 'red-10',
      title: '이벤트 로그 삭제',
      caption: '전체 이벤트 로그 메시지를 삭제 합니다.'
    }
  }).onOk(async () => {
    $q.loading.show()
    try {
      await api.get('/eventlog/deleteall')
      getEventLogs()
      $q.loading.hide()
    } catch (err) {
      $q.loading.hide()
      notifyError({
        message: '로그 삭제 중 오류가 발생하였습니다.',
        caption:
          '잠시후에 다시 시도해 주세요. 오류가 계속되면 관리자에게 문의 해주세요.'
      })
      console.error(err)
    }
  })
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
    <div class="row no-wrap items-center q-gutter-x-md">
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
      <q-separator vertical />
      <IconBtn name="refresh" msg="새로고침" @click="getEventLogs" />
      <IconBtn
        v-if="user && user.admin"
        name="delete"
        color="red-10"
        msg="로그삭제"
        @click="fnDeleteAll"
      />
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
