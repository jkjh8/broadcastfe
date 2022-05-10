<script setup>
import Tooltip from 'components/tooltip'
const props = defineProps({
  name: String,
  size: String,
  color: String,
  msg: String
})
const emit = defineEmits(['click'])
</script>

<template>
  <q-icon
    style="cursor: pointer"
    :name="props.name"
    :size="props.size ?? 'sm'"
    :color="props.color ?? 'primary'"
    @click.prevent.stop="emit('click')"
  >
    <Tooltip v-if="props.msg" :msg="props.msg"></Tooltip>
  </q-icon>
</template>
