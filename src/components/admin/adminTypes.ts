/** Fila de los bloques de datos del detalle (cliente, entrega, factura). */
export interface InfoRow {
  label: string
  value?: string | number | null
  copy?: boolean
  href?: string
}
