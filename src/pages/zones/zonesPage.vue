<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { getDevices } from 'composables/useDevices'
import { zones, getZones } from 'composables/useZones'

import PageName from 'components/layout/pageName.vue'
import DialogAdd from 'components/dialogs/zones/add.vue'
import Confirm from 'components/dialogs/confirm'
import LocalAdd from 'components/dialogs/zones/addLocal'
import Tooltip from 'components/tooltip'
import TooltipDelay from 'components/tooltipdelay'
import IconBtn from 'components/iconBtn'

import useNotify from 'composables/useNotify'
const { notifyWarn, notifyError } = useNotify()

const $q = useQuasar()

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
      await api.get(`/zones/delete?id=${item._id}&name=${item.name}`)
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

function fnAddLocal(item, idx) {
  if (item.channels <= item.children.length && !idx && idx !== 0) {
    return notifyWarn({
      message: '설정한 방송 채널 수를 초과 하였습니다.'
    })
  }
  $q.dialog({
    component: LocalAdd,
    componentProps: { item: item, idx: idx }
  }).onOk(async (childrens) => {
    try {
      $q.loading.show()
      await api.put('/zones/addchildrens', {
        ...item,
        children: childrens
      })
      getZones()
      $q.loading.hide()
    } catch (err) {
      $q.loading.hide()
      notifyError({
        message: '방송구간 추가 중 오류가 발생하였습니다.',
        caption:
          '잠시후에 다시 시도해 주세요. 오류가 계속되면 관리자에게 문의 해주세요.'
      })
      console.error(err)
    }
  })
}

function fnDelLocal(item, idx) {
  $q.dialog({
    component: Confirm,
    componentProps: {
      icon: 'close',
      iconColor: 'black',
      title: '방송구간 삭제',
      caption: '선택된 방송구간을 삭제 합니다.'
    }
  }).onOk(async () => {
    try {
      item.children.splice(idx, 1)
      $q.loading.show()
      await api.put('/zones/addchildrens', {
        ...item
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
    <IconBtn
      name="add_circle"
      size="30px"
      msg="방송구역추가"
      @click="fnAdd()"
    />
  </div>

  <!-- expension item -->
  <div v-if="zones.length" class="bord">
    <q-list style="overflow: hidden">
      <div v-for="zone in zones" :key="zone.index">
        <q-expansion-item
          expand-separator
          default-opened
          header-class="bg-grey-2"
        >
          <template #header>
            <!-- avatar -->
            <q-item-section avatar>
              <q-icon name="svguse:icons.svg#serverColor" color="primary" />
            </q-item-section>
            <!-- zone name -->
            <q-item-section>
              <q-item-label>{{ zone.name }}</q-item-label>
              <q-item-label caption>
                <a
                  :href="`http://${zone.core.ipaddress}`"
                  target="_blank"
                  @click.stop
                >
                  {{ zone.core.ipaddress }}
                </a>
              </q-item-label>
            </q-item-section>
            <!-- function buttons -->
            <q-item-section side>
              <div class="q-gutter-x-md row items-center">
                <IconBtn name="edit" msg="수정" @click="fnAdd(zone)" />
                <IconBtn
                  name="delete"
                  color="red"
                  msg="삭제"
                  @click="fnDelete(zone)"
                />
                <q-separator vertical />
                <IconBtn
                  name="add"
                  msg="방송구역추가"
                  @click="fnAddLocal(zone)"
                />
              </div>
            </q-item-section>
          </template>

          <!-- Children -->
          <div class="fit row wrap q-pa-sm q-gutter-sm">
            <div
              v-for="(children, idx) in zone.children"
              :key="idx"
              class="local"
            >
              <div v-if="children">
                <q-card>
                  <q-card-section
                    :class="
                      children.mode === 'Local' ? 'bg-light-blue' : 'bg-primary'
                    "
                    class="row no-wrap justify-between items-center text-white"
                  >
                    <div class="textOver">
                      {{ children.name }}
                      <TooltipDelay :msg="children.name" />
                    </div>
                    <!-- edit menu -->
                    <q-icon style="cursor: pointer" name="settings">
                      <q-menu
                        style="background: rgba(255, 255, 255, 0.7)"
                        anchor="center middle"
                        self="top left"
                      >
                        <div class="q-pa-sm q-gutter-x-sm">
                          <IconBtn
                            name="edit"
                            size="xs"
                            msg="수정"
                            @click="fnAddLocal(zone, idx)"
                          />
                          <IconBtn
                            name="delete"
                            size="xs"
                            color="red-10"
                            msg="삭제"
                            @click="fnDelLocal(zone, idx)"
                          />
                        </div>
                      </q-menu>
                    </q-icon>
                  </q-card-section>
                  <!-- child info -->
                  <q-card-section>
                    <div>Channel {{ idx + 1 }}</div>
                    <div v-if="children.ipaddress">
                      IP:
                      <a :href="`http://${children.ipaddress}`" target="_blank">
                        {{ children.ipaddress }}
                      </a>
                    </div>
                    <div v-else>Local</div>
                  </q-card-section>
                </q-card>
              </div>
              <!-- None Card -->
              <div v-else class="local">
                <q-card>
                  <q-card-section
                    class="bg-blue-grey text-white row no-wrap justify-between items-center"
                  >
                    <div>None</div>
                    <!-- edit menu -->
                    <q-icon style="cursor: pointer" name="settings">
                      <q-menu
                        style="background: rgba(255, 255, 255, 0.7)"
                        anchor="center middle"
                        self="top left"
                      >
                        <div class="q-pa-sm q-gutter-x-sm">
                          <IconBtn
                            name="edit"
                            size="xs"
                            msg="수정"
                            @click="fnAddLocal(zone, idx)"
                          />
                          <IconBtn
                            name="delete"
                            size="xs"
                            color="red-10"
                            msg="삭제"
                            @click="fnDelLocal(zone, idx)"
                          />
                        </div>
                      </q-menu>
                    </q-icon>
                  </q-card-section>
                  <q-card-section>
                    <div>Channel {{ idx + 1 }}</div>
                    <div>None</div>
                  </q-card-section>
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
  height: 100%;
}
.textOver {
  width: 8rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.bg-trans {
  background: rgba(255, 255, 255, 0.5);
}
</style>
