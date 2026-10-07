import { site } from '@/config/site'
import { readJson, writeJson } from '@/utils/storage'
import type { Order, Product } from '@/types'

/* eslint-disable @typescript-eslint/no-explicit-any */
// Los snippets de Meta, Google y TikTok viven en window sin tipos propios.
type Win = Window & Record<string, any>

const PURCHASED_KEY = 'pawer_tracked_orders'
let started = false

function inject(src: string) {
  const script = document.createElement('script')
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

function initMeta(w: Win, id: string) {
  if (!w.fbq) {
    const fbq: any = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args)
      else fbq.queue.push(args)
    }
    fbq.push = fbq
    fbq.loaded = true
    fbq.version = '2.0'
    fbq.queue = []
    w.fbq = fbq
    w._fbq = fbq
    inject('https://connect.facebook.net/en_US/fbevents.js')
  }
  w.fbq('init', id)
}

function initGtag(w: Win, id: string) {
  w.dataLayer = w.dataLayer || []
  w.gtag = function () {
    // gtag necesita el objeto arguments, no un array.
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments)
  }
  inject(`https://www.googletagmanager.com/gtag/js?id=${id}`)
  w.gtag('js', new Date())
  // El page_view lo mandamos a mano en cada cambio de ruta (es una SPA).
  w.gtag('config', id, { send_page_view: false })
}

function initTiktok(w: Win, id: string) {
  w.TiktokAnalyticsObject = 'ttq'
  const ttq: any = (w.ttq = w.ttq || [])
  const methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie']
  methods.forEach((m) => {
    ttq[m] = (...args: unknown[]) => ttq.push([m, ...args])
  })
  ttq._i = ttq._i || {}
  ttq._i[id] = []
  ttq._i[id]._u = 'https://analytics.tiktok.com/i18n/pixel/events.js'
  ttq._t = ttq._t || {}
  ttq._t[id] = Date.now()
  ttq._o = ttq._o || {}
  ttq._o[id] = {}
  inject(`https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${id}&lib=ttq`)
}

function start() {
  if (started || typeof window === 'undefined') return
  started = true
  const w = window as Win
  const { metaPixelId, gaId, tiktokPixelId } = site.analytics
  if (metaPixelId) initMeta(w, metaPixelId)
  if (gaId) initGtag(w, gaId)
  if (tiktokPixelId) initTiktok(w, tiktokPixelId)
}

function call(fn: (w: Win) => void) {
  start()
  try {
    fn(window as Win)
  } catch {
    // Un bloqueador de anuncios nunca debe romper la compra.
  }
}

const dollars = (cents: number) => Math.round(cents) / 100

export function useAnalytics() {
  function pageView(path: string) {
    call((w) => {
      w.fbq?.('track', 'PageView')
      w.gtag?.('event', 'page_view', { page_path: path, page_location: window.location.href })
      w.ttq?.page?.()
    })
  }

  function viewContent(product: Product, price: number) {
    call((w) => {
      const value = dollars(price)
      w.fbq?.('track', 'ViewContent', { content_ids: [product._id], content_name: product.name, content_type: 'product', value, currency: 'USD' })
      w.gtag?.('event', 'view_item', { currency: 'USD', value, items: [{ item_id: product._id, item_name: product.name, price: value }] })
      w.ttq?.track?.('ViewContent', { content_id: product._id, content_name: product.name, content_type: 'product', value, currency: 'USD' })
    })
  }

  function addToCart(product: Product, qty: number, price: number) {
    call((w) => {
      const value = dollars(price * qty)
      w.fbq?.('track', 'AddToCart', { content_ids: [product._id], content_name: product.name, content_type: 'product', value, currency: 'USD' })
      w.gtag?.('event', 'add_to_cart', { currency: 'USD', value, items: [{ item_id: product._id, item_name: product.name, price: dollars(price), quantity: qty }] })
      w.ttq?.track?.('AddToCart', { content_id: product._id, content_name: product.name, quantity: qty, value, currency: 'USD' })
    })
  }

  function initiateCheckout(total: number, items: number) {
    call((w) => {
      const value = dollars(total)
      w.fbq?.('track', 'InitiateCheckout', { value, currency: 'USD', num_items: items })
      w.gtag?.('event', 'begin_checkout', { currency: 'USD', value })
      w.ttq?.track?.('InitiateCheckout', { value, currency: 'USD' })
    })
  }

  /** Una sola vez por pedido aunque recarguen la página de respuesta. */
  function purchase(order: Order) {
    const tracked = readJson<string[]>(PURCHASED_KEY, [])
    if (tracked.includes(order.number)) return
    writeJson(PURCHASED_KEY, [...tracked, order.number].slice(-20))
    call((w) => {
      const value = dollars(order.total)
      const ids = order.items.map((i) => i.product)
      w.fbq?.('track', 'Purchase', { value, currency: 'USD', content_ids: ids, content_type: 'product' })
      w.gtag?.('event', 'purchase', {
        transaction_id: order.number,
        currency: 'USD',
        value,
        shipping: dollars(order.shippingCost),
        coupon: order.couponCode || undefined,
        items: order.items.map((i) => ({ item_id: i.product, item_name: i.name, price: dollars(i.unitPrice), quantity: i.qty })),
      })
      w.ttq?.track?.('CompletePayment', { value, currency: 'USD', content_type: 'product' })
    })
  }

  return { pageView, viewContent, addToCart, initiateCheckout, purchase }
}
