import { computed, ref } from 'vue'
import { adminService, type AdminOrderPatch } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { statusLabels, waNumber } from './useAdminFormat'
import type { ApiError, Order, OrderStatus } from '@/types'

export interface OrderEditForm {
  status: OrderStatus
  trackingNumber: string
  trackingUrl: string
  notes: string
  note: string
}

// Link de rastreo por defecto: el dueño solo pega la guía y el link se arma solo.
const SERVIENTREGA_URL = 'https://www.servientrega.com.ec/Tracking/?guia='

export function useAdminOrderDetail(id: string) {
  const toast = useToastStore()
  const order = ref<Order | null>(null)
  const loading = ref(true)
  const saving = ref(false)
  const confirmOpen = ref(false)
  const form = ref<OrderEditForm>({
    status: 'pending_payment',
    trackingNumber: '',
    trackingUrl: '',
    notes: '',
    note: '',
  })

  function fillForm(o: Order) {
    form.value = {
      status: o.status,
      trackingNumber: o.trackingNumber || '',
      trackingUrl: o.trackingUrl || '',
      notes: o.notes || '',
      note: '',
    }
  }

  async function load() {
    loading.value = true
    try {
      order.value = await adminService.order(id)
      fillForm(order.value)
    } catch (error) {
      toast.error((error as ApiError).message)
    } finally {
      loading.value = false
    }
  }

  const statusChanged = computed(() => !!order.value && form.value.status !== order.value.status)

  const dirty = computed(() => {
    const o = order.value
    if (!o) return false
    return (
      statusChanged.value ||
      form.value.trackingNumber !== (o.trackingNumber || '') ||
      form.value.trackingUrl !== (o.trackingUrl || '') ||
      form.value.notes !== (o.notes || '')
    )
  })

  function suggestTrackingUrl() {
    const guia = form.value.trackingNumber.trim()
    if (guia && !form.value.trackingUrl.trim()) form.value.trackingUrl = `${SERVIENTREGA_URL}${encodeURIComponent(guia)}&tipo=GUIA`
  }

  /** Primer paso de guardar: si cambia el estado, se pide confirmación porque sale un correo. */
  function requestSave() {
    if (form.value.status === 'shipped' && !form.value.trackingNumber.trim()) {
      toast.error('Para marcar como enviado, ingresa el número de guía de Servientrega')
      return
    }
    if (statusChanged.value) confirmOpen.value = true
    else save()
  }

  async function save() {
    confirmOpen.value = false
    if (!order.value) return
    const patch: AdminOrderPatch = {
      trackingNumber: form.value.trackingNumber.trim(),
      trackingUrl: form.value.trackingUrl.trim(),
      notes: form.value.notes,
    }
    if (statusChanged.value) {
      patch.status = form.value.status
      if (form.value.note.trim()) patch.note = form.value.note.trim()
    }
    saving.value = true
    try {
      order.value = await adminService.updateOrder(order.value._id, patch)
      fillForm(order.value)
      toast.success(patch.status ? `Pedido ${statusLabels[patch.status].toLowerCase()}, cliente notificado` : 'Cambios guardados')
    } catch (error) {
      toast.error((error as ApiError).message)
    } finally {
      saving.value = false
    }
  }

  const whatsappUrl = computed(() => {
    const o = order.value
    if (!o) return ''
    const lines = [`Hola ${o.customer.firstName}, te escribimos de Siempre Pawer por tu pedido ${o.number}.`]
    if (o.status === 'pending_payment' && o.paymentMethod === 'transfer') {
      lines.push('Aún no recibimos el comprobante de tu transferencia. ¿Nos lo puedes enviar por aquí?')
    } else if (o.status === 'shipped' && o.trackingNumber) {
      lines.push(`Tu pedido ya va en camino con Servientrega. Guía: ${o.trackingNumber}`)
      if (o.trackingUrl) lines.push(`Rastréalo aquí: ${o.trackingUrl}`)
    } else {
      lines.push(`Estado actual: ${statusLabels[o.status]}.`)
    }
    const phone = waNumber(o.customer.phone || o.shipping.receiverPhone)
    return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`
  })

  return { order, loading, saving, confirmOpen, form, statusChanged, dirty, load, requestSave, save, suggestTrackingUrl, whatsappUrl }
}
