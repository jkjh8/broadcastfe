<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { getDevices } from 'composables/useDevices'
import { zones, getZones } from 'composables/useZones'

import useNotify from 'composables/useNotify'

import PageName from 'components/layout/pageName.vue'
import DialogAdd from 'components/dialogs/zones/add.vue'
import Confirm from 'components/dialogs/confirm'
import LocalAdd from 'components/dialogs/zones/addLocal'

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

function fnAdd(item) {
  $q.dialog({
    component: DialogAdd,
    componentProps: { item: item }
  }).onOk(async (device) => {
    $q.loading.show()
    try {
      if (device._id) {
        await api.put('/zones', { _id: item._id, ...device })
      } else {
        await api.post('/zones', device)
      }
      getZones()
      $q.loading.hide()
    } catch (err) {
      $q.loading.hide()
      notifyError({
        message: '방송구간 추가(수정) 중 오류가 발생하였습니다.',
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
      title: '방송구간 삭제',
      caption: '선택된 방송구간을 삭제 합니다.',
      message: `${item.name}를(을) 삭제 하시겠습니까?`
    }
  }).onOk(async () => {
    $q.loading.show()
    try {
      await api.get(`/zones/delete?id=${item._id}$name=${item.name}`)
      getZones()
      $q.loading.hide()
    } catch (err) {
      $q.loading.hide()
      notifyError({
        message: '방송구간 삭제 중 오류가 발생하였습니다.',
        caption:
          '잠시후에 다시 시도해 주세요. 오류가 계속되면 관리자에게 문의 해주세요.'
      })
      console.error(err)
    }
  })
}

function fnAddLocal(item) {
  $q.dialog({
    component: LocalAdd,
    componentProps: { item: item }
  }).onOk(async (childrens) => {
    try {
      $q.loading.show()
      await api.put('/zones/addchildrens', {
        id: item._id,
        childrens: childrens
      })
      getZones()
      $q.loading.hide()
    } catch (err) {
      $q.loading.hide()
      notifyError({
        message: '방송구간 삭제 중 오류가 발생하였습니다.',
        caption:
          '잠시후에 다시 시도해 주세요. 오류가 계속되면 관리자에게 문의 해주세요.'
      })
      console.error(err)
    }
  })
}

onMounted(() => {
  getDevices()
  getZones()
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
        color="primary"
        size="30px"
        @click="fnAdd()"
      ></q-icon>
    </div>
  </div>

  <!-- Table -->
  <div v-if="zones.length" class="bord">
    <q-list style="overflow: hidden">
      <div v-for="zone in zones" :key="zone.index">
        <q-expansion-item
          expand-separator
          default-opened
          header-class="bg-grey-2"
        >
          <template #header>
            <q-item-section avatar>
              <q-icon name="svguse:icons.svg#serverColor" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ zone.name }}</q-item-label>
              <q-item-label caption>{{ zone.core.ipaddress }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="row">
                <q-btn
                  round
                  flat
                  icon="edit"
                  color="primary"
                  @click.prevent.stop="fnAdd(zone)"
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
                  color="red"
                  @click.prevent.stop="fnDelete(zone)"
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
                <q-separator class="q-mx-md" vertical />
                <q-btn
                  round
                  flat
                  icon="add"
                  color="primary"
                  @click.prevent.stop="fnAddLocal(zone)"
                >
                  <q-tooltip
                    class="tooltip-bg"
                    anchor="top middle"
                    self="bottom middle"
                    :offset="[10, 10]"
                  >
                    방송지역 추가
                  </q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </template>
          <div class="fit row wrap q-pa-sm q-gutter-sm">
            <div
              v-for="(children, idx) in zone.children"
              :key="idx"
              class="local"
            >
              <div v-if="children">
                <q-card>
                  <q-card-section>
                    <div v-if="children.ipaddress" class="led"></div>
                    <div>Channel: {{ idx + 1 }}</div>
                    <div class="textOver">
                      Name: {{ children.name }}
                      <q-tooltip
                        class="tooltip-bg"
                        anchor="top middle"
                        self="bottom middle"
                        :offset="[10, 10]"
                        :delay="500"
                      >
                        {{ children.name }}
                      </q-tooltip>
                      <div v-if="children.ipaddress">
                        IP: {{ children.ipaddress }}
                      </div>
                      <div v-else>Local</div>
                    </div>
                  </q-card-section>
                  <q-card-actions align="right" class="q-gutter-x-xs">
                    <q-icon
                      class="cursor: pointer"
                      name="edit"
                      size="xs"
                      color="primary"
                    >
                      <q-tooltip
                        class="tooltip-bg"
                        anchor="top middle"
                        self="bottom middle"
                        :offset="[10, 10]"
                      >
                        수정
                      </q-tooltip>
                    </q-icon>
                    <q-icon
                      class="cursor: pointer"
                      name="close"
                      size="sm"
                      color="red"
                    >
                      <q-tooltip
                        class="tooltip-bg"
                        anchor="top middle"
                        self="bottom middle"
                        :offset="[10, 10]"
                      >
                        리셋
                      </q-tooltip>
                    </q-icon>
                  </q-card-actions>
                </q-card>
              </div>
              <div v-else>
                <q-card>
                  <q-card-section>
                    <div>Channel: {{ idx + 1 }}</div>
                    <div>None</div>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-icon
                      class="cursor: pointer"
                      name="edit"
                      size="xs"
                      color="primary"
                    >
                      <q-tooltip
                        class="tooltip-bg"
                        anchor="top middle"
                        self="bottom middle"
                        :offset="[10, 10]"
                      >
                        수정
                      </q-tooltip>
                    </q-icon>
                  </q-card-actions>
                </q-card>
              </div>
            </div>
          </div>
        </q-expansion-item>
      </div>
    </q-list>
  </div>
</template>

<style scoped>
.local {
  width: 10rem;
}
.textOver {
  width: 8rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.led {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  position: absolute;
  top: 5px;
  right: 5px;
  background: #00ff00;
}
</style>
