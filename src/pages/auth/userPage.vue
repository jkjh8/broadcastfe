<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { user } from '@/composables/useAuth.js'
import moment from 'moment'
import Confirm from 'components/dialogs/confirm'
import useNotify from 'composables/useNotify'

const { notifyError } = useNotify()

const $q = useQuasar()
const router = useRouter()

function fnDelete() {
  $q.dialog({
    component: Confirm,
    componentProps: {
      icon: 'delete',
      iconColor: 'red-10',
      title: '계정 탈퇴',
      caption: '사용자 계정 삭제',
      message: '정말 탈퇴 하시겠습니까?'
    }
  }).onOk(async () => {
    $q.loading.show()
    try {
      await api.get(
        `/auth/deleteuser?id=${user.value._id}&name=${user.value.name}&email=${user.value.email}`
      )
      $q.loading.hide()
      router.push('/')
    } catch (err) {
      $q.loading.hide()
      notifyError({
        message: '사용자 계정 삭제 중 오류가 발생하였습니다.',
        caption:
          '잠시후에 다시 시도해 주세요. 오류가 계속되면 관리자에게 문의 해주세요.'
      })
      console.error(err)
    }
  })
}
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
      <q-card-actions align="right">
        <div>
          <q-btn flat color="red" label="탈퇴하기" @click="fnDelete"></q-btn>
        </div>
      </q-card-actions>
    </q-card>
  </div>
</template>
