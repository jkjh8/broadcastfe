<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { api } from 'boot/axios'
import { sender, reciver, getDevices } from 'composables/useDevices'
import {
  required,
  chkIpaddr,
  chkInt,
  chkDeviceIndex,
  chkZoneIndex,
  chkIpExists
} from 'composables/useRules'

import useNotify from 'composables/useNotify'
const { notifyWarn, notifyError } = useNotify()

const $q = useQuasar()

const props = defineProps({ item: Object })
const emit = defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()
const options = ref(reciver.value)
const children = ref([null])
const zone = reactive({
  _id: null,
  index: null,
  core: null,
  name: '',
  channels: 0,
  children: []
})

onMounted(() => {
  getDevices()
  if (props.item) {
    ;(zone._id = props.item._id),
      (zone.index = props.item.index),
      (zone.name = props.item.name),
      (zone.core = props.item.core),
      (zone.channels = props.item.channels),
      (zone.children = props.item.children)
  }
})

function fnFilter(val, update) {
  if (!val) {
    update(() => {
      options.value = reciver.value
    })
  } else {
    update(() => {
      options.value = reciver.value.filter((v) => v.name.indexOf(val) > -1)
    })
  }
}

function addChannel() {
  if (zone.channels <= zone.children.length + children.value.length) {
    return notifyWarn({
      message: '설정한 방송 채널 수를 초과 하였습니다.'
    })
  }
  children.value.push(null)
}

function delChannel(idx) {
  children.value.splice(idx, 1)
}

function checkDub(v) {
  console.log(children.value, v)
  if (v === null) {
    return true
  }
  const dub = []
  for (let i = 0; i < children.value.length; i++) {
    if (children.value[i] === v) {
      dub.push(v)
    }
  }
  if (dub.length > 1) {
    return '같은 방송구간 내 중복된 지역이 있습니다.'
  }
  return true
}

async function checkOther(v) {
  if (v === null) {
    return true
  }
  try {
    const r = await api.get(`/zones/existsChildren?id=${v}`)
    if (r && r.data.result.length) {
      return '다른 방송구간내 중복된 지역이 있습니다.'
    }
  } catch (err) {
    console.error(err)
    return '방송구간 확인중 문제가 발생하였습니다.'
  }
  return true
}

function onSubmit() {
  onDialogOK(zone.children.concat(children.value))
}
</script>

<template>
  <q-dialog ref="dialogRef" persistent @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="border-radius: 8px">
      <q-form @submit="onSubmit">
        <q-card-section class="row no-wrap items-center">
          <q-icon
            class="q-mr-md"
            name="svguse:icons.svg#localColor"
            size="sm"
          />
          <q-item-section>
            <q-item-label class="text-bold" style="font-size: 18px">
              방송지역 추가
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              flat
              round
              icon="add_circle"
              color="green"
              @click="addChannel"
            >
              <q-tooltip
                class="tooltip-bg"
                anchor="top middle"
                self="bottom middle"
                :offset="[10, 10]"
              >
                채널추가
              </q-tooltip>
            </q-btn>
          </q-item-section>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div>
            <div
              class="q-mx-md q-mb-sm row no-wrap justify-between items-center"
              style="font-size: 16px"
            >
              <div>
                <span>
                  <q-icon name="check" color="green" size="md" />
                </span>
                <span>
                  <strong>{{ item.name }}</strong> 방송 지역 추가
                </span>
              </div>
              <div></div>
            </div>
            <div v-for="(child, idx) in children" :key="idx">
              <q-select
                v-model="children[idx]"
                dense
                filled
                use-input
                :label="`Channel ${zone.children.length + idx + 1}`"
                :options="options"
                lazy-rules
                :rules="[checkDub, checkOther]"
                emit-value
                map-options
                option-value="_id"
                option-label="name"
                @filter="fnFilter"
              >
                <template #option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <div
                        v-if="scope.opt.deviceType === 'Q-Sys'"
                        style="color: #0078c1; font-weight: bold"
                      >
                        {{ scope.opt.deviceType.toUpperCase() }}
                      </div>
                      <div v-else style="font-weight: bold">
                        {{ scope.opt.deviceType.toUpperCase() }}
                      </div>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.name }}</q-item-label>
                      <q-item-label caption>{{
                        scope.opt.ipaddress ? scope.opt.ipaddress : 'Local'
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template #after>
                  <q-icon
                    style="cursor: pointer"
                    name="cancel"
                    size="sm"
                    color="red-10"
                    @click="delChannel(idx)"
                  >
                    <q-tooltip
                      class="tooltip-bg"
                      anchor="top middle"
                      self="bottom middle"
                      :offset="[10, 10]"
                    >
                      삭제
                    </q-tooltip>
                  </q-icon>
                </template>
              </q-select>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            style="width: 80px"
            label="취소"
            flat
            rounded
            @click="onDialogCancel"
          />
          <q-btn
            style="width: 80px"
            label="확인"
            class="text-primary"
            flat
            rounded
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
