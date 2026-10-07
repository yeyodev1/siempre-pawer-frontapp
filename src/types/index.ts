/** Forma con la que httpBase rechaza cualquier error del API. */
export interface ApiError {
  status: number
  message: string
  data?: unknown
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

export type AccountType = 'admin' | 'distributor'

/** Lo que devuelve el backapp en /auth/login y /auth/me. */
export interface SessionUser {
  id: string
  email: string
  name: string
  phone: string
  accountType: AccountType | string
  company?: string
}

// Todos los montos del API son enteros en centavos.
export type PaymentMethod = 'card' | 'transfer' | 'cod'
export type ShippingMethod = 'delivery' | 'pickup'
export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  order: number
  isActive: boolean
}

export interface ProductPrices {
  card: number
  transfer: number
  cod: number
}

export interface VolumeTier {
  minQty: number
  unitPrice: number
}

export interface ProductSpec {
  label: string
  value: string
}

export interface Product {
  _id: string
  name: string
  slug: string
  sku?: string
  category?: Category | string | null
  shortDescription?: string
  description?: string
  features: string[]
  specs: ProductSpec[]
  images: string[]
  prices: ProductPrices
  compareAtPrice?: number
  // Solo llega si quien consulta es distribuidor o admin.
  distributorPrice?: number
  volumeTiers: VolumeTier[]
  stock: number
  isPublished: boolean
  isFeatured: boolean
  order: number
  related?: Product[]
  createdAt?: string
}

export interface BankAccount {
  bank: string
  type: string
  number: string
  holder: string
  documentId: string
}

export interface PublicSettings {
  shippingCost: number
  freeShippingFrom: number
  pickupAddress: string
  bankAccounts: BankAccount[]
  whatsapp: string
  announcement: string
  codEnabled: boolean
  transferEnabled: boolean
  payphoneEnabled: boolean
}

export interface CartLine {
  productId: string
  slug: string
  name: string
  image: string
  prices: ProductPrices
  distributorPrice?: number
  volumeTiers: VolumeTier[]
  stock: number
  qty: number
}

export interface QuoteItem {
  productId: string
  name: string
  image: string
  qty: number
  unitPrice: number
  lineTotal: number
}

export interface Quote {
  items: QuoteItem[]
  subtotal: number
  discount: number
  couponCode?: string
  shippingCost: number
  total: number
}

export interface OrderCustomer {
  firstName: string
  lastName: string
  email: string
  phone: string
  documentId: string
}

export interface OrderShipping {
  method: ShippingMethod
  receiverName: string
  receiverPhone: string
  province: string
  city: string
  address: string
  reference: string
}

export interface OrderInvoice {
  required: boolean
  name: string
  documentId: string
  email: string
  address: string
}

export interface OrderItem {
  product: string
  name: string
  slug: string
  image: string
  qty: number
  unitPrice: number
  lineTotal: number
}

export interface OrderHistoryEntry {
  status: OrderStatus
  note?: string
  at: string
}

export interface Order {
  _id: string
  number: string
  customer: OrderCustomer
  shipping: OrderShipping
  invoice: OrderInvoice
  items: OrderItem[]
  paymentMethod: PaymentMethod
  subtotal: number
  discount: number
  couponCode?: string
  shippingCost: number
  total: number
  status: OrderStatus
  trackingNumber?: string
  trackingUrl?: string
  transferReceiptUrl?: string
  isDistributor?: boolean
  history: OrderHistoryEntry[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateOrderPayload {
  items: { productId: string; qty: number }[]
  paymentMethod: PaymentMethod
  couponCode?: string
  customer: OrderCustomer
  shipping: OrderShipping
  invoice: OrderInvoice
}

export interface PayphoneBoxConfig {
  token: string
  storeId: string
  clientTransactionId: string
  amount: number
  amountWithoutTax: number
  currency: 'USD'
  reference: string
  email: string
  phoneNumber: string
  documentId: string
}

export interface CreateOrderResponse {
  order: Order
  payphone?: PayphoneBoxConfig
}

export interface Coupon {
  _id: string
  code: string
  influencerName: string
  influencerEmail?: string
  influencerInstagram?: string
  discountPct: number
  commissionPct: number
  isActive: boolean
  uses: number
  salesTotal: number
  commissionTotal: number
  notes?: string
}

export interface Distributor {
  _id: string
  name: string
  email: string
  phone?: string
  company?: string
  ruc?: string
  city?: string
  isActive: boolean
  createdAt?: string
}

export interface AdminSettings extends Omit<PublicSettings, 'payphoneEnabled'> {
  payphoneEnabled?: boolean
}

export interface AdminStats {
  ordersToday: number
  salesMonth: number
  pendingOrders: number
  lowStock: Product[]
  topProducts: { name: string; qty: number }[]
  recentOrders: Order[]
}
