<script setup>
import { useRouter } from 'vue-router'
import UserState from 'components/layout/userState'
const router = useRouter()
const clickHome = () => {
  console.log('home')
  router.push('/')
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar
        class="bg-white text-grey-10 row justify-around"
        style="height: 3rem"
      >
        <div class="row no-wrap items-center q-gutter-x-md">
          <q-icon
            class="home"
            name="svguse:icons.svg#logo"
            color="primary"
            size="sm"
            @click="clickHome"
          />
          <div class="home gt-xs text-h6" @click="clickHome">Media Server</div>
          <div>Menu</div>
        </div>
        <div>
          <UserState />
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
