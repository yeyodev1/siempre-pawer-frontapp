import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { orderService } from '@/services/order.service'
import { useSettingsStore } from '@/stores/settings'
import { useToastStore } from '@/stores/toast'
import { copy } from '@/config/copy'
import { readJson } from '@/utils/storage'
import type { ApiError, Order } from '@/types'

export const LAST_ORDER_KEY = 'pawer_last_order'

export function useOrderTrack() {
  const route = useRoute()
  const router = useRouter()
  const settings = useSettingsStore()
  const toast = useToastStore()

  const order = ref<Order | null>(null)
  const loading = ref(false)
  const error = ref('')
  const uploading = ref(false)

  const number = computed(() => String(route.params.number || '').toUpperCase())
  const isNew = computed(() => route.query.nuevo === '1')

  // Si llega sin ?email= pero es el último pedido de este navegador, lo usamos.
  const email = computed(() => {
    if (typeof route.query.email === 'string' && route.query.email) return route.query.email
    const last = readJson<{ number: string; email: string } | null>(LAST_ORDER_KEY, null)
    return last && last.number === number.value ? last.email : ''
  })

  const awaitingTransfer = computed(
    () => order.value?.paymentMethod === 'transfer' && order.value.status === 'pending_payment',
  )

  async function load() {
    if (!email.value) return
    loading.value = true
    error.value = ''
    try {
      order.value = await orderService.track(number.value, email.value)
    } catch (e) {
      const err = e as ApiError
      order.value = null
      error.value = err.status === 404 ? copy.order.notFound : err.message
    } finally {
      loading.value = false
    }
  }

  function submitEmail(value: string) {
    router.replace({ query: { ...route.query, email: value.trim().toLowerCase() } })
  }

  async function uploadReceipt(file: File) {
    if (!order.value) return
    uploading.value = true
    try {
      order.value = await orderService.uploadReceipt(number.value, email.value, file)
      toast.success(copy.order.receiptSent)
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      uploading.value = false
    }
  }

  settings.load()
  watch([number, email], load, { immediate: true })

  return { order, loading, error, email, number, isNew, awaitingTransfer, uploading, settings, load, submitEmail, uploadReceipt }
}
