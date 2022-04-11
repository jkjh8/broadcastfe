<script setup>
import { reactive, toRefs } from 'vue'
import { useQuasar, useDialogPluginComponent } from 'quasar'

const props = defineProps({ items: Object })
const emit = defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()

const device = reactive({
  index: 0,
  name: '',
  ipaddress: '',
  port: 4444,
  deviceType: '',
  mode: '',
  channels: 0,
  channel: 0,
  parent: {},
  children: []
})

function onSubmit() {
  onDialogOK()
}

const required = (v) => !!v || '필수 입력 항목 입니다.'
const ipaddress = (v) =>
  /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm.test(
    v
  ) || 'IPv4 형식이 아닙니다'
defineExpose({ ...toRefs(device) })
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
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
            <q-input v-model="index" dense filled label="ID" type="number" />
            <q-input v-model="name" dense filled label="Name" />
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
