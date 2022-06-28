<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { api } from 'boot/axios'
import { sender, reciver, getDevices } from 'composables/useDevices'
import { childToId } from 'composables/useZones'
import {
  required,
  chkIpaddr,
  chkInt,
  chkDeviceIndex,
  chkZoneIndex,
  chkIpExists
} from 'composables/useRules'
import useNotify from 'composables/useNotify'
import SetChannels from 'components/dialogs/zones/channels'

const $q = useQuasar()
const { notifyWarn, notifyError } = useNotify()

const props = defineProps({ item: Object })
const emit = defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const edit = ref(false)
// cores to optioins
const options = ref(sender.value)
const zone = reactive({
  _id: null,
  index: null,
  core: null,
  name: '',
  channels: 0,
  children: []
})

// check zone core dub
async function chkZone(v) {
  const r = await api.get(`/zones/exists?id=${v._id}`)
  if (!zone._id) {
    if (!r.data) {
      return true
    } else {
      return '디바이스가 중복되었습니다.'
    }
  } else {
    if (zone._id !== r.data._id) {
      return '디바이스가 중복되었습니다.'
    }
  }
  return true
}

onMounted(() => {
  getDevices()
  if (props.item) {
    ;(zone._id = props.item._id),
      (zone.index = props.item.index),
      (zone.name = props.item.name),
      (zone.core = props.item.core),
      (zone.channels = props.item.channels),
      (zone.children = props.item.children)
    edit.value = true
  }
})

function fnFilter(val, update) {
  if (!val) {
    update(() => {
      options.value = sender.value
    })
  } else {
    update(() => {
      options.value = sender.value.filter((v) => v.name.indexOf(val) > -1)
    })
  }
}

async function onSubmit() {
  $q.loading.show()
  try {
    // check channel length
    if (zone.children.length > zone.channels) {
      zone.children = zone.children.slice(0, zone.channels)
    }
    // make rt object
    const r = {
      zone: zone,
      update: {
        ...zone,
        core: zone.core._id,
        children: childToId(zone.children)
      }
    }
    // return
    if (zone._id) {
      await api.put('/zones', r)
    } else {
      await api.post('/zones', r)
    }
    $q.loading.hide()
  } catch (err) {
    $q.loading.hide()
    console.error(err)
    notifyError({
      message: '방송구간 추가(수정) 중 오류가 발생하였습니다.'
    })
  }
  onDialogOK(zone)
}
</script>

<template>
  <q-dialog ref="dialogRef" persistent @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="border-radius: 8px">
      <q-form @submit="onSubmit">
        <q-card-section class="row no-wrap items-center">
          <q-icon
            class="q-mr-md"
            name="svguse:icons.svg#serverColorPlus"
            size="sm"
          />
          <q-item-section>
            <q-item-label class="text-bold" style="font-size: 18px">
              방송구간 추가/수정
            </q-item-label>
          </q-item-section>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div>
            <q-input
              v-model="zone.index"
              dense
              filled
              label="Index"
              type="number"
              :disable="edit"
              lazy-rules
              :rules="[required, chkInt, chkZoneIndex]"
            />
            <q-input
              v-model="zone.name"
              dense
              filled
              label="Name"
              lazy-rules
              :rules="[required]"
            />
            <q-select
              v-model="zone.core"
              dense
              filled
              use-input
              label="Core"
              :options="options"
              lazy-rules
              :rules="[required, chkZone]"
              emit-value
              map-options
              option-label="name"
              @filter="fnFilter"
            >
              <template #option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    {{ scope.opt.deviceType }}
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                    <q-item-label caption>{{
                      scope.opt.ipaddress ? scope.opt.ipaddress : 'Local'
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-input
              v-model="zone.channels"
              dense
              filled
              label="Channels"
              lazy-rules
              type="number"
              :rules="[required, chkInt]"
            />
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
