<script setup>
import { ref } from 'vue'

const required = (v) => !!v || '필수 입력 항목 입니다.'
const chkEmail = (v) => /.+@.+\..+/.test(v) || '올바른 형식이 아닙니다'
const chkLength = (v) => v.length >= 8 || '최소 8자 이상 입력하세요'

const userInfo = ref({
  email: '',
  password: ''
})
const saveEmail = ref(false)
function onLogin() {
  console.log(userInfo.value)
}
</script>

<template>
  <div class="column justify-start items-center">
    <div
      style="padding-top: 5%; width: 100%; max-width: 500px; min-width: 300px"
    >
      <div class="text-grey-6">이메일로 로그인하기</div>
      <q-separator></q-separator>
    </div>
    <q-form
      @submit="onLogin"
      class="q-gutter-y-md"
      style="padding-top: 2%; width: 100%; max-width: 500px; min-width: 300px"
    >
      <div class="text-bold">이메일 주소</div>
      <q-input
        v-model="userInfo.email"
        outlined
        placeholder="이메일 주소"
        :rules="[required, chkEmail]"
        lazy-rules
      ></q-input>
      <div class="text-bold">비밀번호</div>
      <q-input
        v-model="userInfo.password"
        outlined
        placeholder="비밀번호"
        :rules="[required, chkLength]"
        lazy-rules
      ></q-input>

      <div>
        <q-checkbox v-model="saveEmail" />
        <span>이메일 저장하기</span>
      </div>
      <q-btn
        class="full-width text-bold animate__animated animate__pulse"
        rounded
        unelevated
        color="primary"
        style="height: 2.5rem"
        type="submit"
      >
        로그인하기
      </q-btn>
      <q-separator></q-separator>
      <div class="text-bold text-center">계정이 없나요?</div>
      <button class="full-width-btn">가입하기</button>
    </q-form>
  </div>
</template>

<style>
.full-width-btn {
  background: transparent;
  border: 1px solid #aaa;
  border-radius: 2rem;
  width: 100%;
  height: 2.5rem;
}
.full-width-btn:hover {
  border-color: #111;
  background: #fdfdfd;
}
</style>
