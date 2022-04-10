<script setup>
import { useQuasar, useDialogPluginComponent } from 'quasar'

const props = defineProps({ items: Object })
const emit = defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="border-radius: 8px">
      <q-card-section class="row no-wrap items-center">
        <q-icon
          class="q-mr-md"
          name="svguse:icons.svg#serverColorPlus"
          size="sm"
        />
        <q-item-section>
          <q-item-label class="text-bold" style="font-size: 18px"
            >하드웨어 추가/수정</q-item-label
          >
        </q-item-section>
      </q-card-section>
      <q-separator />
      <q-card-section> 123123 </q-card-section>

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
          @click="onDialogOK"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
