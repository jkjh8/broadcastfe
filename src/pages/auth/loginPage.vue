<script setup>
import { ref, onMounted } from 'vue'
import { LocalStorage, useQuasar } from 'quasar'
import { updateUser } from '@/composables/useAuth'
import { api } from 'boot/axios'
import { socket } from 'boot/socketio'
import { useRouter } from 'vue-router'
import useNotify from '@/composables/useNotify'
import { required, chkEmail, chkLength } from 'composables/useRules'

const router = useRouter()
const $q = useQuasar()
const { notifyInfo, notifyWarn } = useNotify()

const userInfo = ref({
  email: '',
  password: ''
})
const saveEmail = ref(false)
const showPassword = ref(false)

async function onLogin() {
  try {
    $q.loading.show()
    const r = await api.post('/auth', userInfo.value)
    $q.loading.hide()
    console.log(r)
    if (r.data.status) {
      socket.connect()
      router.push('/')
    } else {
      notifyWarn({ message: r.data.message })
    }
  } catch (err) {
    $q.loading.hide()
    console.error(err)
    updateUser(null)
  }
}

function fnSetEmailLocalStorage(value) {
  if (value) {
    if (userInfo.value.email) {
      LocalStorage.set('email', userInfo.value.email)
    }
  } else {
    LocalStorage.remove('email')
  }
}

onMounted(() => {
  if (LocalStorage.has('email')) {
    saveEmail.value = true
    userInfo.value.email = LocalStorage.getItem('email')
  }
})
</script>

<template>
  <div class="column justify-start items-center">
    <div
      style="padding-top: 5%; width: 100%; max-width: 500px; min-width: 250px"
    >
      <div class="text-grey-6">이메일로 로그인하기</div>
      <q-separator style="margin-bottom: 1rem" />
    </div>

    <div
      class="q-gutter-y-md"
      style="padding-top: 2%; width: 100%; max-width: 500px; min-width: 250px"
    >
      <q-form @submit="onLogin">
        <div class="text-bold">이메일 주소</div>
        <q-input
          v-model="userInfo.email"
          outlined
          placeholder="이메일 주소"
          :rules="[required, chkEmail]"
          lazy-rules
        />
        <div class="text-bold">비밀번호</div>
        <q-input
          v-model="userInfo.password"
          outlined
          placeholder="비밀번호"
          :type="showPassword ? 'text' : 'password'"
          :rules="[required, chkLength]"
          lazy-rules
        >
          <template #append>
            <q-icon
              class="q-mr-md"
              style="cursor: pointer"
              :name="showPassword ? 'visibility' : 'visibility_off'"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <div class="row items-center">
          <q-checkbox
            v-model="saveEmail"
            @update:model-value="fnSetEmailLocalStorage"
          />
          <span class="q-mt-xs">이메일 저장하기</span>
        </div>
        <q-btn
          class="full-width text-bold animate__animated animate__pulse"
          rounded
          unelevated
          color="primary"
          style="height: 2.8rem"
          type="submit"
        >
          로그인하기
        </q-btn>
      </q-form>

      <q-separator style="margin: 2rem 0" />
      <div class="text-bold text-center">계정이 없나요?</div>
      <q-btn
        class="full-width"
        style="height: 2.8rem; border: 1px solid #e1e1e1"
        unelevated
        rounded
        to="/auth/register"
      >
        가입하기
      </q-btn>
    </div>
  </div>
</template>
