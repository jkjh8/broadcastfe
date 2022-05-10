<script setup>
const props = defineProps({ msg: String })
</script>

<template>
  <q-tooltip
    class="tooltip-bg"
    anchor="top middle"
    self="bottom middle"
    :offset="[10, 10]"
  >
    {{ props.msg }}
  </q-tooltip>
</template>
