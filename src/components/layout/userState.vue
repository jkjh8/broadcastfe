<script setup>
import { user, updateUser, getNickName } from '@/composables/useAuth.js'
import { api } from '@/boot/axios'

async function fnLogout() {
  const r = await api.get('/auth/logout')
  updateUser(null)
}
</script>

<template>
  <div v-if="!user">
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
  </div>

  <div v-else>
    <q-avatar
      size="md"
      round
      color="primary"
      text-color="white"
      @click="fnLogout"
    >
      {{ getNickName() }}
    </q-avatar>
  </div>
</template>
