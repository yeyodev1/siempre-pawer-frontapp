import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { catalogService, type ProductQuery } from '@/services/catalog.service'
import { useCategories } from './useCategories'
import type { ApiError, Product } from '@/types'

type Sort = NonNullable<ProductQuery['sort']>
const LIMIT = 12

export function useShop() {
  const route = useRoute()
  const router = useRouter()
  const { categories, load: loadCategories } = useCategories()

  const products = ref<Product[]>([])
  const page = ref(1)
  const pages = ref(1)
  const total = ref(0)
  const loading = ref(false)
  const loadingMore = ref(false)
  const error = ref('')

  const category = computed(() => (route.params.category as string) || '')
  const search = computed(() => (typeof route.query.search === 'string' ? route.query.search : ''))
  const sort = computed<Sort>(() => {
    const value = route.query.sort
    return value === 'price_asc' || value === 'price_desc' ? value : 'newest'
  })
  const currentCategory = computed(() => categories.value.find((c) => c.slug === category.value))
  const hasMore = computed(() => page.value < pages.value)

  // Evita que una respuesta lenta pise a una más nueva.
  let request = 0

  async function fetchPage(next: number) {
    const id = ++request
    const query: ProductQuery = {
      category: category.value || undefined,
      search: search.value || undefined,
      sort: sort.value,
      page: next,
      limit: LIMIT,
    }
    const result = await catalogService.products(query)
    if (id !== request) return
    products.value = next === 1 ? result.items : [...products.value, ...result.items]
    page.value = result.page
    pages.value = result.pages
    total.value = result.total
  }

  async function reload() {
    loading.value = true
    error.value = ''
    try {
      await fetchPage(1)
    } catch (e) {
      error.value = (e as ApiError).message
      products.value = []
    } finally {
      loading.value = false
    }
  }

  async function loadMore() {
    if (!hasMore.value || loadingMore.value) return
    loadingMore.value = true
    try {
      await fetchPage(page.value + 1)
    } catch {
      /* el botón queda visible para reintentar */
    } finally {
      loadingMore.value = false
    }
  }

  function setSort(value: string) {
    router.replace({ query: { ...route.query, sort: value === 'newest' ? undefined : value } })
  }

  watch([category, search, sort], reload, { immediate: true })
  loadCategories()

  return {
    products, categories, category, currentCategory, search, sort, total,
    loading, loadingMore, error, hasMore, reload, loadMore, setSort,
  }
}
