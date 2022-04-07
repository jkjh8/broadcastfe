<script setup>
import { ref } from 'vue'
import { user } from '@/composables/useAuth.js'
import moment from 'moment'
</script>

<template>
  <div class="row justify-between items-center">
    <div>
      <q-item>
        <q-item-section avatar>
          <q-icon name="svguse:icons.svg#usersColor" size="md" />
        </q-item-section>
        <q-item-section>
          <q-item-label> 사용자 정보 </q-item-label>
          <q-item-label caption>나의 계정 및 로그인 정보 확인</q-item-label>
        </q-item-section>
      </q-item>
    </div>
  </div>
  <div class="row justify-center">
    <q-card
      class="q-mt-lg"
      style="min-width: 300px; max-width: 400px; width: 80%"
    >
      <q-card-section class="bg-grey-2">
        <div>사용자 정보</div>
      </q-card-section>
      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label> 이름 </q-item-label>
              <q-item-label caption>{{ user.name }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label> 이메일 </q-item-label>
              <q-item-label caption>{{ user.email }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label> 관리자 </q-item-label>
              <q-item-label caption>{{ user.admin }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label> 사용자 등급 </q-item-label>
              <q-item-label caption>{{ user.level }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label> 로그인 횟수 </q-item-label>
              <q-item-label caption>{{ user.numberOfLogin }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label> 마지막 로그인 </q-item-label>
              <q-item-label caption>{{
                moment(user.loginAt).format('YYYY-MM-DD hh:mm:ss a')
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label> 가입일 </q-item-label>
              <q-item-label caption>{{
                moment(user.createdAt).format('YYYY-MM-DD hh:mm:ss a')
              }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>
