<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { user } from '@/composables/useAuth'

const router = useRouter()

const clickHome = () => {
  console.log('home')
  router.push('/')
}

onMounted(() => {
  if (user.value && user.value.email) {
    clickHome()
  }
})
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar
        class="bg-white text-grey-10 row justify-around"
        style="height: 4rem"
      >
        <div class="row no-wrap items-center q-gutter-x-md">
          <q-icon
            class="home"
            name="svguse:icons.svg#logo"
            color="primary"
            size="md"
            @click="clickHome"
          />
          <div class="home gt-xs text-h5" @click="clickHome">Media Server</div>
        </div>
      </q-toolbar>
      <q-separator color="grey-3" />
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.home {
  cursor: pointer;
  font-weight: 700;
}
.btn {
  border-color: #eee;
}
</style>
