<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { sender, reciver, getDevices } from 'composables/useDevices'

const props = defineProps({ item: Object })
const emit = defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()
const options = ref(reciver.value)
const chList = ref([])

onMounted(() => {
  if (props.item.children.length > 0) {
    chList.value = props.item.children
  } else {
    chList.value = new Array(Number(props.item.channels))
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

function onSubmit() {
  onDialogOK(chList.value)
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
              {{ item.name }} 채널 셋업
            </q-item-label>
          </q-item-section>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-gutter-y-md">
          <div v-for="(zone, idx) in chList" :key="zone">
            <q-select
              v-model="chList[idx]"
              dense
              filled
              use-input
              label="방송구간"
              :options="options"
              emit-value
              map-options
              option-value="_id"
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
