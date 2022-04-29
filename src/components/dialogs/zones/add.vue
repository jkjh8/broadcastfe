<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { sender, reciver } from 'composables/useDevices'
import {
  required,
  chkIpaddr,
  chkInt,
  chkDeviceIndex,
  chkZoneIndex,
  chkIpExists
} from 'composables/useRules'

const props = defineProps({ item: Object })
const emit = defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()
const edit = ref(false)
const zone = reactive({
  _id: null,
  index: null,
  core: null,
  name: '',
  channels: null,
  children: null
})

onMounted(() => {
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

function onSubmit() {
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
              하드웨어 추가/수정
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
              label="Core"
              :options="sender"
              lazy-rules
              :rules="[required]"
              emit-value
              map-options
              option-value="_id"
              option-label="name"
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
