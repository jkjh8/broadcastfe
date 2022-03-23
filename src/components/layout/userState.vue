<script setup>
import { user } from '@/composables/useAuth.js'
console.log(user.value)
</script>

<template>
  <q-btn
    round
    flat
    color="grey-2"
    text-color="primary"
    icon="fas fa-user"
    size="sm"
    to="/auth/login"
  >
    <q-tooltip class="tooltip" :delay="500"> Login </q-tooltip>
  </q-btn>
</template>
