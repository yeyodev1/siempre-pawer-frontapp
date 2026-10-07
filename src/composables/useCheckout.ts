import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { orderService } from '@/services/order.service'
import { useCartStore } from '@/stores/cart'
import { useSettingsStore } from '@/stores/settings'
import { useToastStore } from '@/stores/toast'
import { copy } from '@/config/copy'
import { removeKey, writeJson } from '@/utils/storage'
import { useAnalytics } from './useAnalytics'
import { useCheckoutForm, DRAFT_KEY } from './useCheckoutForm'
import { usePaymentMethod } from './usePaymentMethod'
import { usePayphone } from './usePayphone'
import { LAST_ORDER_KEY } from './useOrderTrack'
import type { ApiError, CreateOrderPayload, Order, PayphoneBoxConfig, Quote } from '@/types'

export function useCheckout() {
  const router = useRouter()
  const cart = useCartStore()
  const settings = useSettingsStore()
  const toast = useToastStore()
  const analytics = useAnalytics()
  const { customer, shipping, invoice, couponInput, coupon } = useCheckoutForm()
  const { method, isDistributor } = usePaymentMethod()
  const payphone = usePayphone()

  const quote = ref<Quote | null>(null)
  const quoteLoading = ref(false)
  const quoteError = ref('')
  const couponLoading = ref(false)
  const couponError = ref('')
  const submitting = ref(false)
  const payphoneConfig = ref<PayphoneBoxConfig | null>(null)
  const pendingOrder = ref<Order | null>(null)

  const items = computed(() => cart.lines.map((l) => ({ productId: l.productId, qty: l.qty })))
  const quoteKey = computed(() =>
    JSON.stringify([items.value, method.value, coupon.value?.code, shipping.method]),
  )

  let timer: ReturnType<typeof setTimeout> | undefined
  let request = 0

  async function fetchQuote() {
    if (!items.value.length) {
      quote.value = null
      return
    }
    const id = ++request
    quoteLoading.value = true
    quoteError.value = ''
    try {
      const result = await orderService.quote({
        items: items.value,
        paymentMethod: method.value,
        couponCode: isDistributor.value ? undefined : coupon.value?.code,
        shippingMethod: shipping.method,
      })
      if (id === request) quote.value = result
    } catch (e) {
      if (id === request) quoteError.value = (e as ApiError).message || copy.checkout.quoteError
    } finally {
      if (id === request) quoteLoading.value = false
    }
  }

  watch(quoteKey, () => {
    clearTimeout(timer)
    timer = setTimeout(fetchQuote, 350)
  })

  async function applyCoupon() {
    const code = couponInput.value.trim().toUpperCase()
    if (!code) return
    couponLoading.value = true
    couponError.value = ''
    try {
      coupon.value = await orderService.validateCoupon(code)
      couponInput.value = coupon.value.code
    } catch (e) {
      coupon.value = null
      couponError.value = (e as ApiError).message
    } finally {
      couponLoading.value = false
    }
  }

  function removeCoupon() {
    coupon.value = null
    couponInput.value = ''
    removeKey('pawer_ref')
  }

  function buildPayload(): CreateOrderPayload {
    const isPickup = shipping.method === 'pickup'
    const fullName = `${customer.firstName} ${customer.lastName}`.trim()
    return {
      items: items.value,
      paymentMethod: method.value,
      couponCode: isDistributor.value ? undefined : coupon.value?.code,
      customer: { ...customer, email: customer.email.trim().toLowerCase() },
      shipping: isPickup
        ? { method: 'pickup', receiverName: fullName, receiverPhone: customer.phone, province: 'Guayas', city: 'Guayaquil', address: settings.settings.pickupAddress, reference: '' }
        : { ...shipping, receiverName: shipping.receiverName || fullName, receiverPhone: shipping.receiverPhone || customer.phone },
      invoice: invoice.required ? { ...invoice } : { required: false, name: '', documentId: '', email: '', address: '' },
    }
  }

  async function submit() {
    if (!items.value.length || submitting.value) return
    submitting.value = true
    try {
      const payload = buildPayload()
      const { order, payphone: config } = await orderService.create(payload)
      writeJson(DRAFT_KEY, { customer: payload.customer, shipping: { ...shipping } })
      writeJson(LAST_ORDER_KEY, { number: order.number, email: order.customer.email })

      if (method.value === 'card' && config) {
        pendingOrder.value = order
        payphoneConfig.value = config
        await nextTick()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        await payphone.mount(config)
        return
      }

      analytics.purchase(order)
      cart.clear()
      removeKey('pawer_ref')
      router.push({ name: 'OrderTrack', params: { number: order.number }, query: { email: order.customer.email, nuevo: '1' } })
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      submitting.value = false
    }
  }

  function retryPayphone() {
    if (payphoneConfig.value) payphone.mount(payphoneConfig.value)
  }

  // Cambiar de método crea un pedido nuevo; el pendiente lo cancela el admin o vence.
  function cancelPayphone() {
    payphoneConfig.value = null
    pendingOrder.value = null
  }

  onMounted(async () => {
    await settings.load()
    if (couponInput.value && !coupon.value && !isDistributor.value) applyCoupon()
    await fetchQuote()
    if (cart.lines.length) analytics.initiateCheckout(quote.value?.total || cart.estimatedSubtotal(), cart.count)
  })

  return {
    quote, quoteLoading, quoteError, couponLoading, couponError, submitting,
    payphoneConfig, pendingOrder, payphoneStatus: payphone.status,
    applyCoupon, removeCoupon, submit, retryPayphone, cancelPayphone, fetchQuote,
  }
}
