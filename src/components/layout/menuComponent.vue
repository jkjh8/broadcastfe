<template>
  <div style="padding-top: 5px">
    <q-btn class="q-px-md q-py-sm" style="border-radius: 10px" flat>
      <div>Zones</div>

      <q-menu :offset="[0, 20]">
        <q-list separator style="min-width: 300px">
          <q-item clickable to="/zones">
            <q-item-section avatar>
              <q-avatar
                style="border: solid 1px #eee"
                rounded
                icon="svguse:icons.svg#mapColor"
              ></q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>방송구간관리</q-item-label>
              <q-item-label caption>방송구간 추가 및 삭제</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable to="/device">
            <q-item-section avatar>
              <q-avatar
                style="border: solid 1px #eee"
                rounded
                icon="svguse:icons.svg#serverColorPlus"
              ></q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>장치 및 로컬</q-item-label>
              <q-item-label caption>장치 및 로컬 방송 구간 관리</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

    <q-btn
      class="q-px-md q-py-sm"
      style="border-radius: 10px"
      flat
      to="/eventlog"
    >
      <div>Event Log</div>
    </q-btn>
    <q-btn class="q-px-md q-py-sm" style="border-radius: 10px" flat>
      <div>ADMIN</div>

      <q-menu :offset="[0, 20]">
        <q-list separator style="min-width: 300px">
          <q-item clickable to="/admin/usermanagement">
            <q-item-section avatar>
              <q-avatar
                style="border: solid 1px #eee"
                rounded
                icon="svguse:icons.svg#usersColor"
              ></q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label> 사용자 관리 </q-item-label>
              <q-item-label caption> 사용자 권한 및 계정 관리</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<style scoped></style>
