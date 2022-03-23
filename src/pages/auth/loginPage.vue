<script setup>
import { ref } from 'vue'
const userInfo = ref({
  email: '',
  password: ''
})
const saveEmail = ref(false)
</script>
<template>
  <div class="column justify-start items-center">
    <div
      style="padding-top: 5%; width: 100%; max-width: 500px; min-width: 300px"
    >
      <div class="text-grey-6">이메일로 로그인하기</div>
      <q-separator></q-separator>
    </div>
    <div
      class="q-gutter-y-md"
      style="padding-top: 2%; width: 100%; max-width: 500px; min-width: 300px"
    >
      <div class="text-bold">이메일 주소</div>
      <q-input
        v-model="userInfo.email"
        outlined
        placeholder="이메일 주소"
      ></q-input>
      <div class="text-bold">비밀번호</div>
      <q-input
        v-model="userInfo.password"
        outlined
        placeholder="비밀번호"
      ></q-input>

      <div>
        <q-checkbox v-model="saveEmail" />
        <span>이메일 저장하기</span>
      </div>
      <q-btn
        class="full-width text-bold"
        rounded
        unelevated
        color="primary"
        style="height: 2.5rem"
        >로그인하기</q-btn
      >
      <q-separator></q-separator>
      <div class="text-bold text-center">계정이 없나요?</div>
      <button class="full-width-btn">가입하기</button>
    </div>
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
