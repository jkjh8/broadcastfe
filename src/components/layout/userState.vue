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
    <q-btn flat round>
      <q-avatar size="md" round color="primary" text-color="white">
        {{ getNickName() }}
      </q-avatar>

      <q-menu :offset="[0, 20]">
        <div>
          <div style="padding: 20px 80px 20px 80px">
            <q-avatar size="80px" round color="primary" text-color="white">
              {{ getNickName() }}
            </q-avatar>
          </div>
          <div class="column justify-center items-center">
            <div class="text-h6">
              {{ user.name }}
            </div>

            <div class="text-caption">
              {{ user.email }}
            </div>

            <q-btn
              class="q-my-md q-px-lg"
              style="border: solid 1px #aaa"
              rounded
              unelevated
            >
              사용자 계정 관리
            </q-btn>
          </div>
          <q-separator />
          <div class="row justify-center items-center">
            <q-btn class="q-my-md q-px-lg" flat rounded @click="fnLogout">
              로그아웃
            </q-btn>
          </div>
        </div>
      </q-menu>
    </q-btn>
  </div>
</template>
