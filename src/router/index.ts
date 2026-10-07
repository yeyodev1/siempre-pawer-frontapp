import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { site } from '@/config/site'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: site.name },
  },
  {
    path: '/tienda',
    name: 'Shop',
    component: () => import('@/views/ShopView.vue'),
    meta: { title: 'Tienda' },
  },
  {
    path: '/tienda/:category',
    name: 'ShopCategory',
    component: () => import('@/views/ShopView.vue'),
    meta: { title: 'Tienda' },
  },
  {
    path: '/producto/:slug',
    name: 'Product',
    component: () => import('@/views/ProductView.vue'),
    meta: { title: 'Producto' },
  },
  {
    path: '/carrito',
    name: 'Cart',
    component: () => import('@/views/CartView.vue'),
    meta: { title: 'Carrito' },
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/CheckoutView.vue'),
    meta: { title: 'Finalizar compra' },
  },
  {
    // URL de respuesta registrada en Payphone Developer.
    path: '/pago/respuesta',
    name: 'PaymentResponse',
    component: () => import('@/views/PaymentResponseView.vue'),
    meta: { title: 'Confirmando pago' },
  },
  {
    path: '/pedido/:number',
    name: 'OrderTrack',
    component: () => import('@/views/OrderTrackView.vue'),
    meta: { title: 'Tu pedido' },
  },
  {
    path: '/rastrear',
    name: 'TrackLookup',
    component: () => import('@/views/TrackLookupView.vue'),
    meta: { title: 'Rastrear pedido' },
  },
  {
    path: '/distribuidores',
    name: 'Distributors',
    component: () => import('@/views/DistributorsView.vue'),
    meta: { title: 'Distribuidores' },
  },
  {
    path: '/politicas/:slug',
    name: 'Policy',
    component: () => import('@/views/PolicyView.vue'),
    meta: { title: 'Políticas' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Ingresar', guestOnly: true },
  },
  {
    path: '/cuenta',
    name: 'Account',
    component: () => import('@/views/AccountView.vue'),
    meta: { title: 'Mi cuenta', requiresAuth: true },
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, layout: 'admin' },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/AdminDashboardView.vue'),
        meta: { title: 'Panel' },
      },
      {
        path: 'pedidos',
        name: 'AdminOrders',
        component: () => import('@/views/admin/AdminOrdersView.vue'),
        meta: { title: 'Pedidos' },
      },
      {
        path: 'pedidos/:id',
        name: 'AdminOrderDetail',
        component: () => import('@/views/admin/AdminOrderDetailView.vue'),
        meta: { title: 'Pedido' },
      },
      {
        path: 'productos',
        name: 'AdminProducts',
        component: () => import('@/views/admin/AdminProductsView.vue'),
        meta: { title: 'Productos' },
      },
      {
        path: 'productos/nuevo',
        name: 'AdminProductNew',
        component: () => import('@/views/admin/AdminProductEditView.vue'),
        meta: { title: 'Nuevo producto' },
      },
      {
        path: 'productos/:id',
        name: 'AdminProductEdit',
        component: () => import('@/views/admin/AdminProductEditView.vue'),
        meta: { title: 'Editar producto' },
      },
      {
        path: 'categorias',
        name: 'AdminCategories',
        component: () => import('@/views/admin/AdminCategoriesView.vue'),
        meta: { title: 'Categorías' },
      },
      {
        path: 'cupones',
        name: 'AdminCoupons',
        component: () => import('@/views/admin/AdminCouponsView.vue'),
        meta: { title: 'Cupones e influencers' },
      },
      {
        path: 'distribuidores',
        name: 'AdminDistributors',
        component: () => import('@/views/admin/AdminDistributorsView.vue'),
        meta: { title: 'Distribuidores' },
      },
      {
        path: 'ajustes',
        name: 'AdminSettings',
        component: () => import('@/views/admin/AdminSettingsView.vue'),
        meta: { title: 'Ajustes' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Página no encontrada' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Con "atrás" el navegador devuelve la posición guardada; con un hash se
  // baja a la sección; si no, arriba.
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { left: 0, top: 0 }
  },
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  // El link de influencer (?ref=CODIGO) puede llegar a cualquier página.
  const ref = to.query.ref
  if (typeof ref === 'string' && ref.trim()) {
    try {
      localStorage.setItem('pawer_ref', ref.trim().toUpperCase())
    } catch {
      // Sin storage el cliente puede escribir el código a mano en el checkout.
    }
  }

  if (to.meta.requiresAuth || to.meta.guestOnly) {
    // La sesión se verifica contra el API una sola vez por carga.
    await userStore.restore()
  }

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return { name: 'Login', query: { next: to.fullPath }, replace: true }
  }

  if (to.matched.some((r) => r.meta.requiresAdmin) && !userStore.isAdmin) {
    return { name: 'Home', replace: true }
  }

  if (to.meta.guestOnly && userStore.isAuthenticated) {
    return userStore.isAdmin
      ? { name: 'AdminDashboard', replace: true }
      : { name: 'Shop', replace: true }
  }
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title && title !== site.name ? `${title} — ${site.name}` : site.name
})

export default router
