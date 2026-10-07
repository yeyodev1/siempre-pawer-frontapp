import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { copy } from '@/config/copy'
import { unitPrice } from '@/utils/pricing'
import { useAnalytics } from './useAnalytics'
import { usePaymentMethod } from './usePaymentMethod'
import type { Product } from '@/types'

export function useAddToCart() {
  const cart = useCartStore()
  const toast = useToastStore()
  const analytics = useAnalytics()
  const { method, isDistributor } = usePaymentMethod()

  function add(product: Product, qty = 1) {
    if (product.stock <= 0) return
    cart.add(product, qty)
    analytics.addToCart(product, qty, unitPrice(product, method.value, qty, isDistributor.value))
    toast.success(copy.product.added)
  }

  return { add }
}
