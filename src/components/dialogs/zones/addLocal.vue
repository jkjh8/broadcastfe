<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { api } from 'boot/axios'
import { sender, reciver, getDevices } from 'composables/useDevices'
import { children, chkZoneDebLocal, chkZoneDub } from 'composables/useRules'
import IconBtn from 'components/iconBtn'

import useNotify from 'composables/useNotify'
const { notifyWarn, notifyError } = useNotify()

const $q = useQuasar()

const props = defineProps({ item: Object, idx: Number })
const emit = defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()
const options = ref(reciver.value)
const zone = reactive({
  _id: null,
  index: null,
  core: null,
  name: '',
  channels: 0,
  children: []
})

const channel = ref(null)

onMounted(() => {
  getDevices()
  children.value = [null]
  if (props.item) {
    ;(zone._id = props.item._id),
      (zone.index = props.item.index),
      (zone.name = props.item.name),
      (zone.core = props.item.core),
      (zone.channels = props.item.channels),
      (zone.children = props.item.children)
  }
  if (props.idx || props.idx === 0) {
    channel.value = props.idx
    if (zone.children[props.idx] && zone.children[props.idx]._id) {
      children.value[0] = zone.children[props.idx]._id
    }
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

function chkNetworkChannel(v) {
  if (!v) {
    return true
  }
  let netChannels = 0
  let recvDevice = null
  const model = zone.core.model.toLowerCase()
  switch (model) {
    case '510i':
      netChannels = 32
      break
    default:
      netChannels = 4
      break
  }

  for (let i = 0; i < reciver.value.length; i++) {
    if (reciver.value[i]._id === v) {
      if (
        (recvDevice =
          reciver.value[i].mode && reciver.value[i].mode === 'Local')
      )
        return true
    }
  }

  if (props.idx || props.idx === 0) {
    if (props.idx >= netChannels) {
      return '사용할 수 있는 네트워크 채널을 초과 했습니다.'
    }
  } else {
    for (let i = 0; i < children.value.length; i++) {
      if (children.value[i] === v) {
        if (zone.children.length + i >= netChannels) {
          return '사용할 수 있는 네트워크 채널을 초과 했습니다.'
        }
      }
    }
  }

  return true
}

async function onSubmit() {
  if (channel.value || channel.value === 0) {
    zone.children[channel.value] = children.value[0]
    return onDialogOK(zone.children)
  }
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
            <q-item-label class="text-bold" style="font-size: 20px">
              방송지역 추가
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <IconBtn
              v-if="!(channel || channel === 0)"
              name="add_circle"
              size="md"
              color="green"
              msg="채널추가"
              @click="addChannel"
            />
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
                clearable
                :label="
                  channel || channel === 0
                    ? `Channel ${channel + 1}`
                    : `Channel ${zone.children.length + idx + 1}`
                "
                :options="options"
                lazy-rules
                :rules="[chkZoneDebLocal, chkZoneDub, chkNetworkChannel]"
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
                  <IconBtn
                    v-if="!(channel || channel === 0)"
                    name="cancel"
                    size="sm"
                    color="red-10"
                    msg="삭제"
                    @click="delChannel(idx)"
                  />
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
