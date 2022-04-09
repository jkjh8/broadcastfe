<script setup>
import { useQuasar, useDialogPluginComponent } from 'quasar'

const props = defineProps({ items: Object })
const emit = defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card>
      <q-card-section> Dialog </q-card-section>
    </q-card>
  </q-dialog>
</template>
