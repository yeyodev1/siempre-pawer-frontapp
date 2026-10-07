export interface AdminNavItem {
  name: string
  label: string
  short: string
  icon: string
}

// Una sola lista para el sidebar, el menú móvil y la barra inferior.
export const adminNav: AdminNavItem[] = [
  { name: 'AdminDashboard', label: 'Panel', short: 'Panel', icon: 'fa-solid fa-gauge-high' },
  { name: 'AdminOrders', label: 'Pedidos', short: 'Pedidos', icon: 'fa-solid fa-receipt' },
  { name: 'AdminProducts', label: 'Productos', short: 'Productos', icon: 'fa-solid fa-futbol' },
  { name: 'AdminCategories', label: 'Categorías', short: 'Categorías', icon: 'fa-solid fa-layer-group' },
  { name: 'AdminCoupons', label: 'Cupones e influencers', short: 'Cupones', icon: 'fa-solid fa-ticket' },
  { name: 'AdminDistributors', label: 'Distribuidores', short: 'Distrib.', icon: 'fa-solid fa-truck-ramp-box' },
  { name: 'AdminSettings', label: 'Ajustes', short: 'Ajustes', icon: 'fa-solid fa-sliders' },
]

// En el celular la barra inferior muestra solo lo del día a día; el resto va en "Menú".
export const adminBottomNav = ['AdminDashboard', 'AdminOrders', 'AdminProducts', 'AdminCoupons']
