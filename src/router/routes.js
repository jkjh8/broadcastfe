const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }]
  },
  {
    path: '/auth',
    component: () => import('layouts/SimpleLayout.vue'),
    children: [
      { path: 'login', component: () => import('pages/auth/loginPage.vue') },
      {
        path: 'register',
        component: () => import('pages/auth/registerPage.vue')
      },
      { path: 'user', component: () => import('pages/auth/userPage.vue') }
    ]
  },
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'devicelog',
        component: () => import('pages/admin/deviceLogPage.vue')
      },
      {
        path: 'usermanagement',
        component: () => import('pages/admin/usersPage.vue')
      }
    ]
  },

  {
    path: '/device',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/device/devicePage.vue')
      }
    ]
  },

  {
    path: '/eventLog',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/eventLogPage.vue')
      }
    ]
  },

  {
    path: '/zones',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/zones/zonesPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
