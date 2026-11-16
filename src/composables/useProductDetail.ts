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
  const size = ref('')
  const color = ref('')
  const added = ref(false)

  const slug = computed(() => route.params.slug as string)
  const soldOut = computed(() => (product.value?.stock ?? 0) <= 0)
  const related = computed(() => product.value?.related || [])
  const variants = computed(() => product.value?.variants || [])
  const sizes = computed(() => variants.value.map((v) => v.size).filter(Boolean))
  const colors = computed(() => variants.value.find((v) => v.size === size.value)?.colors || [])
  // Mismo formato que el backend ("8/10 · Negro"); así valida la combinación.
  const variant = computed(() => [size.value, color.value].filter(Boolean).join(' · '))

  // Al cambiar de talla se conserva el color si existe en la nueva; si no, el primero.
  watch(size, () => {
    if (!colors.value.includes(color.value)) color.value = colors.value[0] || ''
  })
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
      size.value = data.variants?.[0]?.size || ''
      color.value = data.variants?.[0]?.colors?.[0] || ''
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
    if (!product.value) return
    add(product.value, qty.value, variant.value, true)
    added.value = true
  }

  watch(slug, (value) => value && load(), { immediate: true })

  return {
    product, loading, error, notFound, qty, soldOut, related, currentUnit, whatsapp, load, addToCart,
    isDistributor, method, sizes, colors, size, color, variant, added,
  }
}
