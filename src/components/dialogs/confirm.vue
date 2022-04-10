<script setup>
import { useQuasar, useDialogPluginComponent } from 'quasar'

const props = defineProps({
  icon: String,
  iconColor: String,
  title: String,
  caption: String,
  message: String
})
const emit = defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="border-radius: 8px">
      <q-card-section class="row no-wrap items-center">
        <div v-if="icon" avatar class="q-mr-md">
          <q-icon
            :name="icon"
            :color="iconColor ? iconColor : 'primary'"
            size="32px"
          />
        </div>
        <q-item-section>
          <q-item-label class="text-h6 text-bold">
            {{ title }}
          </q-item-label>
          <q-item-label v-if="caption" caption>
            {{ caption }}
          </q-item-label>
        </q-item-section>
      </q-card-section>
      <q-card-section class="text-center">
        {{ message }}
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
          @click="onDialogOK"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style>
.confirmDialog {
  width: 400px;
  min-width: 350px;
  border-radius: 0.5rem;
}
</style>
