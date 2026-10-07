const moneyFormat = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export function formatMoney(value: number): string {
  return moneyFormat.format(value)
}

/** El API maneja todos los montos en centavos enteros. */
export function money(cents: number | null | undefined): string {
  return moneyFormat.format((cents || 0) / 100)
}

const date = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export function formatDate(value: string | Date): string {
  return date.format(typeof value === 'string' ? new Date(value) : value)
}

const dateTime = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDateTime(value: string | Date): string {
  return dateTime.format(typeof value === 'string' ? new Date(value) : value)
}
