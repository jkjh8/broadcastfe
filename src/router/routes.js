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
      }
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

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
