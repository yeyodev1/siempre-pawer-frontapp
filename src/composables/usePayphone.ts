import { ref } from 'vue'
import type { PayphoneBoxConfig } from '@/types'

const CSS_URL = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.css'
const JS_URL = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.js'

let loader: Promise<void> | null = null

function hasBox(): boolean {
  return 'PPaymentButtonBox' in window
}

// El script es un módulo: onload no garantiza que la clase ya esté en window.
function waitForBox(timeout = 8000): Promise<void> {
  return new Promise((resolve, reject) => {
    const started = Date.now()
    const tick = () => {
      if (hasBox()) return resolve()
      if (Date.now() - started > timeout) return reject(new Error('timeout'))
      setTimeout(tick, 100)
    }
    tick()
  })
}

function loadAssets(): Promise<void> {
  if (loader) return loader
  loader = new Promise<void>((resolve, reject) => {
    if (!document.querySelector(`link[href="${CSS_URL}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = CSS_URL
      document.head.appendChild(link)
    }
    if (hasBox()) return resolve()
    const script = document.createElement('script')
    script.type = 'module'
    script.src = JS_URL
    script.onload = () => waitForBox().then(resolve, reject)
    script.onerror = () => reject(new Error('script'))
    document.head.appendChild(script)
  }).catch((error) => {
    loader = null
    throw error
  })
  return loader
}

export const PAYPHONE_CONTAINER = 'pp-button'

export function usePayphone() {
  const status = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')

  async function mount(config: PayphoneBoxConfig) {
    status.value = 'loading'
    try {
      await loadAssets()
      const box = new PPaymentButtonBox({
        token: config.token,
        clientTransactionId: config.clientTransactionId,
        amount: config.amount,
        amountWithoutTax: config.amountWithoutTax,
        currency: config.currency,
        storeId: config.storeId,
        reference: config.reference,
        lang: 'es',
        defaultMethod: 'card',
        timeZone: -5,
        email: config.email,
        phoneNumber: config.phoneNumber,
        documentId: config.documentId,
      })
      box.render(PAYPHONE_CONTAINER)
      status.value = 'ready'
    } catch {
      status.value = 'error'
    }
  }

  return { status, mount }
}
