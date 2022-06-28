<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar, useDialogPluginComponent } from 'quasar'
import {
  required,
  chkIpaddr,
  chkInt,
  chkDeviceIndex,
  chkIpExists
} from 'composables/useRules'

const props = defineProps({ item: Object })
const emit = defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const edit = ref(false)
const device = reactive({
  _id: null,
  index: null,
  name: '',
  ipaddress: '',
  deviceType: '',
  mode: '',
  model: ''
})
3575

onMounted(() => {
  if (props.item) {
    ;(device._id = props.item._id),
      (device.index = props.item.index),
      (device.name = props.item.name),
      (device.ipaddress = props.item.ipaddress),
      (device.deviceType = props.item.deviceType),
      (device.mode = props.item.mode),
      (device.model = props.item.model)
    edit.value = true
  }
})

function onSubmit() {
  onDialogOK(device)
}
</script>

<template>
  <q-dialog ref="dialogRef" persistent>
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
              하드웨어 추가/수정
            </q-item-label>
          </q-item-section>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div>
            <q-input
              v-model="device.index"
              dense
              filled
              label="ID"
              type="number"
              :disable="edit"
              lazy-rules
              :rules="[required, chkInt, chkDeviceIndex]"
            />
            <q-input
              v-model="device.name"
              dense
              filled
              label="Name"
              lazy-rules
              :rules="[required]"
            />
            <q-select
              v-model="device.deviceType"
              dense
              filled
              label="Device Type"
              :options="['Q-Sys', 'Barix']"
              lazy-rules
              :rules="[required]"
            />
            <q-select
              v-if="device.deviceType === 'Barix'"
              v-model="device.mode"
              dense
              filled
              label="Mode"
              :options="['Send', 'Receive']"
              lazy-rules
              :rules="[required]"
            />
            <q-select
              v-if="device.deviceType === 'Q-Sys'"
              v-model="device.mode"
              dense
              filled
              label="Mode"
              :options="['Core', 'Local']"
              lazy-rules
              :rules="[required]"
            />
            <q-select
              v-if="device.deviceType === 'Q-Sys' && device.mode !== 'Local'"
              v-model="device.model"
              dense
              filled
              label="Model"
              :options="['110f', '510i']"
              lazy-rules
              :rules="[required]"
            />
            <q-input
              v-if="device.mode !== 'Local'"
              v-model="device.ipaddress"
              dense
              filled
              label="IP Address"
              :disable="edit"
              lazy-rules
              :rules="[required, chkIpaddr, chkIpExists]"
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
