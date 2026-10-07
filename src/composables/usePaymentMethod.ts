import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useSettingsStore } from '@/stores/settings'
import { useUserStore } from '@/stores/user'
import type { PaymentMethod } from '@/types'

/**
 * El método elegido se guarda en el carrito, pero el efectivo depende de lo
 * que la tienda tenga encendido y de si quien compra es distribuidor.
 */
export function usePaymentMethod() {
  const cart = useCartStore()
  const settings = useSettingsStore()
  const user = useUserStore()

  const isDistributor = computed(() => user.isDistributor)

  const methods = computed<PaymentMethod[]>(() =>
    isDistributor.value ? ['transfer'] : settings.paymentMethods,
  )

  const method = computed<PaymentMethod>(() =>
    methods.value.includes(cart.paymentMethod) ? cart.paymentMethod : methods.value[0] || 'transfer',
  )

  function select(next: PaymentMethod) {
    cart.setPaymentMethod(next)
  }

  return { methods, method, select, isDistributor }
}
