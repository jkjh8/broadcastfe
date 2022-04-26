<template>
  <div style="padding-top: 5px">
    <q-btn class="q-px-md q-py-sm" style="border-radius: 10px" flat to="/zones">
      <div>Zones</div>
    </q-btn>
    <q-btn
      class="q-px-md q-py-sm"
      style="border-radius: 10px"
      flat
      to="/device"
    >
      <div>Devices</div>
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
          <q-item clickable to="/admin/devicelog">
            <q-item-section avatar>
              <q-avatar
                style="border: solid 1px #eee"
                rounded
                icon="svguse:icons.svg#serverColorInfo"
              ></q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label> 관리자 로그 </q-item-label>
              <q-item-label caption> 하드웨어 및 관리자 로그</q-item-label>
            </q-item-section>
          </q-item>

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
