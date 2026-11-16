import { defineStore } from 'pinia'
import { readJson, writeJson } from '@/utils/storage'
import { unitPrice } from '@/utils/pricing'
import type { CartLine, PaymentMethod, Product } from '@/types'

const CART_KEY = 'pawer_cart'
const METHOD_KEY = 'pawer_payment_method'

/** Una línea por producto + variante. */
export function lineKey(line: Pick<CartLine, 'productId' | 'variant'>): string {
  return `${line.productId}|${line.variant || ''}`
}

/** Unidades de un producto en el carrito, sumando todas sus variantes. */
function productQty(lines: CartLine[], productId: string, except?: CartLine): number {
  return lines.filter((l) => l.productId === productId && l !== except).reduce((sum, l) => sum + l.qty, 0)
}

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
    add(product: Product, qty = 1, variant = '') {
      const image = product.images?.[0] || ''
      const key = lineKey({ productId: product._id, variant })
      const existing = this.lines.find((l) => lineKey(l) === key)
      // El stock es del producto: lo comparten todas sus variantes.
      const room = Math.max(0, (product.stock || Infinity) - productQty(this.lines, product._id, existing))
      if (existing) {
        existing.qty = Math.max(1, Math.min(existing.qty + qty, room))
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
          qty: Math.max(1, Math.min(qty, room)),
          variant,
        })
      }
      persist(this.lines)
    },

    setQty(key: string, qty: number) {
      const line = this.lines.find((l) => lineKey(l) === key)
      if (!line) return
      const max = line.stock > 0 ? Math.max(1, line.stock - productQty(this.lines, line.productId, line)) : qty
      line.qty = Math.max(1, Math.min(Math.round(qty) || 1, max))
      persist(this.lines)
    },

    remove(key: string) {
      this.lines = this.lines.filter((l) => lineKey(l) !== key)
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
