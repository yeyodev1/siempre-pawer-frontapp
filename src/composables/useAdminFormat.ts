import type { OrderStatus, PaymentMethod, ShippingMethod } from '@/types'

// Todo monto del API llega en centavos; en pantalla siempre se muestra en dólares.
const money = new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' })

const dateTime = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

const dateOnly = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export function cents(value: number | undefined | null): string {
  return money.format((value || 0) / 100)
}

export function centsToDollars(value: number | undefined | null): string {
  if (value === undefined || value === null) return ''
  return (value / 100).toFixed(2)
}

/** Acepta "25", "25.5" o "25,50" (teclado en español) y devuelve centavos. */
export function dollarsToCents(value: string | number): number {
  const parsed = Number(String(value).replace(',', '.').trim())
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0
}

export function when(value?: string): string {
  return value ? dateTime.format(new Date(value)) : ''
}

export function day(value?: string): string {
  return value ? dateOnly.format(new Date(value)) : ''
}

export const statusLabels: Record<OrderStatus, string> = {
  pending_payment: 'Pago pendiente',
  paid: 'Pagado',
  preparing: 'Preparando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

// Orden en que avanza un pedido; se usa en filtros y en el selector de estado.
export const statusOrder: OrderStatus[] = [
  'pending_payment',
  'paid',
  'preparing',
  'shipped',
  'delivered',
  'cancelled',
]

export const paymentLabels: Record<PaymentMethod, string> = {
  card: 'Tarjeta',
  transfer: 'Transferencia',
  cod: 'Contra entrega',
}

export const paymentIcons: Record<PaymentMethod, string> = {
  card: 'fa-solid fa-credit-card',
  transfer: 'fa-solid fa-building-columns',
  cod: 'fa-solid fa-hand-holding-dollar',
}

export const shippingLabels: Record<ShippingMethod, string> = {
  delivery: 'Envío Servientrega',
  pickup: 'Retiro en Urdesa',
}

/** Teléfono ecuatoriano a formato internacional para wa.me (0991234567 → 593991234567). */
export function waNumber(phone?: string): string {
  const digits = (phone || '').replace(/\D/g, '')
  if (digits.startsWith('593')) return digits
  if (digits.startsWith('0')) return `593${digits.slice(1)}`
  return digits
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function useAdminFormat() {
  return {
    cents,
    centsToDollars,
    dollarsToCents,
    when,
    day,
    statusLabels,
    statusOrder,
    paymentLabels,
    paymentIcons,
    shippingLabels,
    waNumber,
    slugify,
  }
}
