import { reactive, ref } from 'vue'
import { readJson, readString } from '@/utils/storage'
import type { OrderCustomer, OrderInvoice, OrderShipping } from '@/types'

export const DRAFT_KEY = 'pawer_checkout_draft'

interface Draft {
  customer: OrderCustomer
  shipping: OrderShipping
}

const draft = readJson<Partial<Draft>>(DRAFT_KEY, {})

// Estado de módulo: lo comparten las secciones del checkout sin pasar props.
const customer = reactive<OrderCustomer>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  documentId: '',
  ...draft.customer,
})

const shipping = reactive<OrderShipping>({
  method: 'delivery',
  receiverName: '',
  receiverPhone: '',
  province: 'Guayas',
  city: '',
  address: '',
  reference: '',
  ...draft.shipping,
})

const invoice = reactive<OrderInvoice>({
  required: false,
  name: '',
  documentId: '',
  email: '',
  address: '',
})

const couponInput = ref(readString('pawer_ref'))
const coupon = ref<{ code: string; discountPct: number } | null>(null)

export function useCheckoutForm() {
  return { customer, shipping, invoice, couponInput, coupon }
}
