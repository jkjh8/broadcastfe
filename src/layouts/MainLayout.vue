<script setup>
import { useRouter } from 'vue-router'
import UserState from 'components/layout/userState'
import MenuComponent from './menuComponent'

const router = useRouter()
function clickHome() {
  router.push('/')
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <div
        class="bg-white text-grey-10 row justify-around items-center"
        style="height: 3.5rem"
      >
        <div class="row no-wrap items-center q-gutter-x-md">
          <!-- home -->
          <div class="row no-wrap items-center q-gutter-x-md">
            <q-icon
              class="home"
              name="svguse:icons.svg#logo"
              color="primary"
              size="md"
              @click="clickHome"
            />
            <div class="home gt-xs text-h5" @click="clickHome">
              Media Server
            </div>
          </div>
        </div>
        <!-- menu -->
        <MenuComponent />

        <!-- right pan -->
        <div>
          <UserState />
        </div>
      </div>
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
</style>
