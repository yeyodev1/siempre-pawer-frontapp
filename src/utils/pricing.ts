import type { PaymentMethod, ProductPrices, VolumeTier } from '@/types'

interface Priceable {
  prices: ProductPrices
  volumeTiers?: VolumeTier[]
  distributorPrice?: number
}

/** El tier con mayor minQty que la cantidad alcanza, o null. */
export function activeTier(tiers: VolumeTier[] | undefined, qty: number): VolumeTier | null {
  if (!tiers?.length) return null
  return [...tiers].filter((t) => t.minQty <= qty).sort((a, b) => b.minQty - a.minQty)[0] || null
}

/**
 * Misma regla que el backend: el tier está referido al precio con tarjeta y
 * cada método conserva su diferencia. El distribuidor paga su precio fijo,
 * sin tiers. El total real lo decide siempre /orders/quote.
 */
export function unitPrice(
  item: Priceable,
  method: PaymentMethod,
  qty: number,
  isDistributor = false,
): number {
  if (isDistributor && item.distributorPrice) return item.distributorPrice
  const base = item.prices[method]
  const tier = activeTier(item.volumeTiers, qty)
  if (!tier) return base
  return tier.unitPrice + (base - item.prices.card)
}

/** Tiers ordenados de menor a mayor para mostrarlos en el detalle. */
export function sortedTiers(tiers: VolumeTier[] | undefined): VolumeTier[] {
  return [...(tiers || [])].sort((a, b) => a.minQty - b.minQty)
}
