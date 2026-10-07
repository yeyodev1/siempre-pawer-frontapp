import { defineStore } from 'pinia'
import { readJson, writeJson } from '@/utils/storage'
import { unitPrice } from '@/utils/pricing'
import type { CartLine, PaymentMethod, Product } from '@/types'

const CART_KEY = 'pawer_cart'
const METHOD_KEY = 'pawer_payment_method'

function persist(lines: CartLine[]) {
  writeJson(CART_KEY, lines)
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    lines: readJson<CartLine[]>(CART_KEY, []).filter((l) => l && l.productId && l.qty > 0),
    paymentMethod: readJson<PaymentMethod>(METHOD_KEY, 'card'),
  }),

  getters: {
    count: (s) => s.lines.reduce((sum, line) => sum + line.qty, 0),
    isEmpty: (s) => s.lines.length === 0,
  },

  actions: {
    add(product: Product, qty = 1) {
      const image = product.images?.[0] || ''
      const existing = this.lines.find((l) => l.productId === product._id)
      if (existing) {
        existing.qty = Math.min(existing.qty + qty, product.stock || existing.qty + qty)
        // Refresca precios y stock con lo último que dijo el API.
        existing.prices = product.prices
        existing.volumeTiers = product.volumeTiers || []
        existing.distributorPrice = product.distributorPrice
        existing.stock = product.stock
      } else {
        this.lines.push({
          productId: product._id,
          slug: product.slug,
          name: product.name,
          image,
          prices: product.prices,
          distributorPrice: product.distributorPrice,
          volumeTiers: product.volumeTiers || [],
          stock: product.stock,
          qty: Math.max(1, Math.min(qty, product.stock || qty)),
        })
      }
      persist(this.lines)
    },

    setQty(productId: string, qty: number) {
      const line = this.lines.find((l) => l.productId === productId)
      if (!line) return
      const max = line.stock > 0 ? line.stock : qty
      line.qty = Math.max(1, Math.min(Math.round(qty) || 1, max))
      persist(this.lines)
    },

    remove(productId: string) {
      this.lines = this.lines.filter((l) => l.productId !== productId)
      persist(this.lines)
    },

    clear() {
      this.lines = []
      persist(this.lines)
    },

    setPaymentMethod(method: PaymentMethod) {
      this.paymentMethod = method
      writeJson(METHOD_KEY, method)
    },

    /** Precio estimado por línea; el definitivo viene de /orders/quote. */
    lineUnit(line: CartLine, isDistributor = false): number {
      return unitPrice(line, this.paymentMethod, line.qty, isDistributor)
    },

    estimatedSubtotal(isDistributor = false): number {
      return this.lines.reduce((sum, l) => sum + this.lineUnit(l, isDistributor) * l.qty, 0)
    },
  },
})
