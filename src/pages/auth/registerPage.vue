<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'

const required = (v) => !!v || '필수 입력 항목 입니다.'
const chkEmail = (v) => /.+@.+\..+/.test(v) || '올바른 형식이 아닙니다'
const chkEmailUsed = (v) => fnCheckEmail(v) || '이미 사용중인 이메일 입니다.'
const chkLength = (v) => v.length >= 8 || '최소 8자 이상 입력하세요'
const chkPassword = (v) =>
  v === userInfo.value.password || '비밀번호가 일치하지 않습니다.'

const userInfo = ref({
  name: '',
  email: '',
  password: '',
  chkPassword: ''
})
const saveEmail = ref(false)
const showPassword = ref(false)
const showChkPassword = ref(false)

async function fnCheckEmail(value) {
  const r = await api.get(`/auth/checkEmail?email=${value}`)
  return r.status
}

async function onRegister() {
  console.log(userInfo.value)
  await api.post('/auth/register', userInfo.value)
}
</script>

<template>
  <div class="column justify-start items-center">
    <div
      style="padding-top: 5%; width: 100%; max-width: 500px; min-width: 250px"
    >
      <div class="text-grey-6">이메일로 가입하기</div>
      <q-separator style="margin-bottom: 1rem" />
    </div>

    <div
      class="q-gutter-y-md"
      style="padding-top: 2%; width: 100%; max-width: 500px; min-width: 250px"
    >
      <q-form @submit="onRegister">
        <div class="text-bold">이메일 주소</div>
        <q-input
          v-model="userInfo.email"
          outlined
          placeholder="이메일 주소"
          :rules="[required, chkEmail, chkEmailUsed]"
          lazy-rules
        />
        <div class="text-bold">이름</div>
        <q-input
          v-model="userInfo.name"
          outlined
          placeholder="이름"
          :rules="[required]"
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

        <div class="text-bold">비밀번호 확인</div>
        <q-input
          v-model="userInfo.chkPassword"
          outlined
          placeholder="비밀번호 확인"
          :type="showChkPassword ? 'text' : 'password'"
          :rules="[required, chkLength, chkPassword]"
          lazy-rules
        >
          <template #append>
            <q-icon
              class="q-mr-md"
              style="cursor: pointer"
              :name="showChkPassword ? 'visibility' : 'visibility_off'"
              @click="showChkPassword = !showChkPassword"
            />
          </template>
        </q-input>

        <q-btn
          class="full-width text-bold q-mt-lg"
          rounded
          unelevated
          color="primary"
          style="height: 2.8rem"
          type="submit"
        >
          가입하기
        </q-btn>
      </q-form>

      <q-separator style="margin: 2rem 0" />
      <div class="row justify-center">
        <q-btn flat rounded to="/">홈으로</q-btn>
      </div>
    </div>
  </div>
</template>
