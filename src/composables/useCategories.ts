import { ref } from 'vue'
import { catalogService } from '@/services/catalog.service'
import type { Category } from '@/types'

// Estado de módulo: las categorías casi no cambian y las usan varias vistas.
const categories = ref<Category[]>([])
const loaded = ref(false)
let pending: Promise<void> | null = null

export function useCategories() {
  function load(): Promise<void> {
    if (loaded.value) return Promise.resolve()
    if (pending) return pending
    pending = catalogService
      .categories()
      .then((list) => {
        categories.value = list
        loaded.value = true
      })
      .catch(() => {
        /* sin categorías la tienda sigue funcionando con "Todo" */
      })
      .finally(() => {
        pending = null
      })
    return pending
  }

  return { categories, loaded, load }
}
