<script setup>
import { onMounted, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import moment from 'moment'
import { api } from 'boot/axios'

import PageName from 'components/layout/pageName.vue'
import Confirm from 'components/dialogs/confirm.vue'

const columns = [
  {
    name: 'name',
    align: 'center',
    label: 'Name',
    field: 'name',
    sortable: true
  },
  {
    name: 'email',
    align: 'center',
    label: 'E-Mail',
    field: 'email',
    sortable: true
  },
  {
    name: 'admin',
    align: 'center',
    label: 'Admin',
    field: 'admin',
    sortable: true
  },
  {
    name: 'zones',
    align: 'center',
    label: 'Zones',
    field: 'zones',
    sortable: true
  },
  {
    name: 'numberOfLogin',
    align: 'center',
    label: 'Logins',
    field: 'numberOfLogin',
    sortable: true
  },
  {
    name: 'createdAt',
    align: 'center',
    label: 'Created',
    field: 'createdAt',
    sortable: true
  },
  {
    name: 'lastLogin',
    align: 'center',
    label: 'Last Login',
    field: 'lastLogin',
    sortable: true
  },
  {
    name: 'actions',
    align: 'center',
    label: 'Actions'
  }
]

const $q = useQuasar()
const search = ref('')
const users = ref([])
async function getUsers() {
  const r = await api.get('/auth/users')
  users.value = r.data.users
}

const initPagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10
})

const filter = ref('')

const totalPages = computed(() => {
  return Math.ceil(users.value.length / initPagination.value.rowsPerPage)
})

async function fnSetAdmin(user) {
  $q.dialog({
    component: Confirm,
    componentProps: {
      icon: 'warning',
      iconColor: 'yellow',
      title: '관리자 권한',
      caption: '관리자 권한을 부여하거나 회수합니다.',
      message: `${user.email}의 관리자 권한이 변경 됩니다.`
    }
  }).onOk(async () => {
    await api.get(`/auth/setadmin?id=${user._id}&admin=${!user.admin}`)
    await getUsers()
  })
}

async function fnDeleteUser(user) {
  $q.dialog({
    component: Confirm,
    componentProps: {
      icon: 'warning',
      iconColor: 'red',
      title: '사용자 계정 삭제',
      caption: '사용자 계정을 삭제합니다.',
      message: `${user.email} 계정을 삭제 하시겠습니까?`
    }
  }).onOk(async () => {
    await api.get(`/auth/deleteuser?id=${user._id}`)
    await getUsers()
  })
}

onMounted(() => {
  getUsers()
})
</script>

<template>
  <div class="row justify-between items-center">
    <PageName
      name="사용자 관리"
      caption="사용자 권한 변경 및 계정 관리"
      icon="svguse:icons.svg#usersColor"
    />
    <div>
      <q-input v-model="filter" filled dense clearable label="Search">
        <template #append>
          <q-icon name="search"></q-icon>
        </template>
      </q-input>
    </div>
  </div>

  <!-- Tabel -->
  <div class="bord">
    <q-table
      style="border-radius: 0.5rem"
      table-header-class="text-h6 text-bold bg-grey-2"
      :rows="users"
      :columns="columns"
      flat
      hide-pagination
      :pagination="initPagination"
      :filter="filter"
    >
      <!-- body -->
      <template #body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="email" :props="props">
            {{ props.row.email }}
          </q-td>
          <q-td key="admin" :props="props">
            <q-icon
              style="cursor: pointer"
              :name="props.row.admin ? 'fas fa-circle-check' : 'fas fa-ban'"
              :color="props.row.admin ? 'green' : 'red'"
              @click="fnSetAdmin(props.row)"
            />
          </q-td>
          <q-td key="zones" :props="props">
            <q-btn
              icon="fas fa-folder-tree"
              size="sm"
              flat
              round
              color="primary"
            ></q-btn>
          </q-td>
          <q-td key="numberOfLogin" :props="props">
            {{ props.row.numberOfLogin }}
          </q-td>
          <q-td key="createdAt" :props="props">
            {{ moment(props.row.createdAt).format('YYYY-MM-DD hh:mm:ss a') }}
          </q-td>
          <q-td key="lastLogin" :props="props">
            {{ moment(props.row.lastLogin).format('YYYY-MM-DD hh:mm:ss a') }}
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              icon="fas fa-trash"
              flat
              round
              size="sm"
              color="red-10"
              @click="fnDeleteUser(props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <div class="q-mt-md row justify-center">
    <q-pagination
      v-model="initPagination.page"
      :max="totalPages"
      :max-pages="10"
      direction-links
      boundary-links
    />
  </div>
</template>
