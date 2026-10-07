/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_META_PIXEL_ID: string
  readonly VITE_GA_ID: string
  readonly VITE_TIKTOK_PIXEL_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Cajita de Pagos de Payphone: el script del CDN la expone como global.
interface PPaymentButtonBoxOptions {
  token: string
  clientTransactionId: string
  amount: number
  amountWithoutTax: number
  currency: string
  storeId: string
  reference: string
  lang?: string
  defaultMethod?: string
  timeZone?: number
  email?: string
  phoneNumber?: string
  documentId?: string
}
declare class PPaymentButtonBox {
  constructor(options: PPaymentButtonBoxOptions)
  render(containerId: string): void
}
