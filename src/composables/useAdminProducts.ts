import { ref, watch } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Category, Product } from '@/types'

export function useAdminProducts() {
  const toast = useToastStore()

  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const search = ref('')
  const category = ref('')
  const page = ref(1)
  const pages = ref(1)
  const total = ref(0)
  const loading = ref(false)
  const toDelete = ref<Product | null>(null)

  async function load() {
    loading.value = true
    try {
      const result = await adminService.products({
        search: search.value.trim(),
        category: category.value,
        page: page.value,
      })
      products.value = result.items
      pages.value = result.pages || 1
      total.value = result.total
    } catch (error) {
      toast.error((error as ApiError).message)
    } finally {
      loading.value = false
    }
  }

  async function loadCategories() {
    try {
      categories.value = await adminService.categories()
    } catch {
      // El filtro por categoría es opcional; la lista funciona sin él.
    }
  }

  let timer: ReturnType<typeof setTimeout> | undefined
  watch(search, () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      page.value = 1
      load()
    }, 350)
  })

  watch(category, () => {
    page.value = 1
    load()
  })

  function goTo(next: number) {
    page.value = next
    load()
  }

  /** Edición rápida desde la lista (stock, publicado, destacado) sin abrir el editor. */
  async function quickUpdate(product: Product, changes: Partial<Pick<Product, 'stock' | 'isPublished' | 'isFeatured'>>) {
    const previous = { ...product }
    Object.assign(product, changes)
    try {
      const updated = await adminService.updateProduct(product._id, changes)
      Object.assign(product, { stock: updated.stock, isPublished: updated.isPublished, isFeatured: updated.isFeatured })
      if ('stock' in changes) toast.success(`Stock de ${product.name}: ${updated.stock}`)
    } catch (error) {
      Object.assign(product, previous)
      toast.error((error as ApiError).message)
    }
  }

  async function confirmDelete() {
    const target = toDelete.value
    if (!target) return
    toDelete.value = null
    try {
      await adminService.deleteProduct(target._id)
      products.value = products.value.filter((p) => p._id !== target._id)
      total.value -= 1
      toast.success('Producto eliminado')
    } catch (error) {
      toast.error((error as ApiError).message)
    }
  }

  return {
    products,
    categories,
    search,
    category,
    page,
    pages,
    total,
    loading,
    toDelete,
    load,
    loadCategories,
    goTo,
    quickUpdate,
    confirmDelete,
  }
}
