import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { catalogService } from '@/services/catalog.service'
import { site, whatsappLink } from '@/config/site'
import { copy } from '@/config/copy'
import { unitPrice } from '@/utils/pricing'
import { useAnalytics } from './useAnalytics'
import { useAddToCart } from './useAddToCart'
import { usePaymentMethod } from './usePaymentMethod'
import type { ApiError, Product } from '@/types'

export function useProductDetail() {
  const route = useRoute()
  const analytics = useAnalytics()
  const { add } = useAddToCart()
  const { method, isDistributor } = usePaymentMethod()

  const product = ref<Product | null>(null)
  const loading = ref(true)
  const error = ref('')
  const notFound = ref(false)
  const qty = ref(1)

  const slug = computed(() => route.params.slug as string)
  const soldOut = computed(() => (product.value?.stock ?? 0) <= 0)
  const related = computed(() => product.value?.related || [])
  const currentUnit = computed(() =>
    product.value ? unitPrice(product.value, method.value, qty.value, isDistributor.value) : 0,
  )
  const whatsapp = computed(() => {
    if (!product.value) return whatsappLink()
    const url = `${site.url}/producto/${product.value.slug}`
    return whatsappLink(copy.product.whatsappMessage(product.value.name, url))
  })

  async function load() {
    loading.value = true
    error.value = ''
    notFound.value = false
    qty.value = 1
    try {
      const data = await catalogService.product(slug.value)
      product.value = data
      document.title = `${data.name} — ${site.name}`
      analytics.viewContent(data, unitPrice(data, 'card', 1, isDistributor.value))
    } catch (e) {
      const err = e as ApiError
      product.value = null
      if (err.status === 404) notFound.value = true
      else error.value = err.message
    } finally {
      loading.value = false
    }
  }

  function addToCart() {
    if (product.value) add(product.value, qty.value)
  }

  watch(slug, (value) => value && load(), { immediate: true })

  return { product, loading, error, notFound, qty, soldOut, related, currentUnit, whatsapp, load, addToCart, isDistributor, method }
}
