import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { adminService, type ProductPayload } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { slugify } from './useAdminFormat'
import type { ApiError, Category, Product } from '@/types'

function blank(): ProductPayload {
  return {
    name: '',
    slug: '',
    sku: '',
    category: null,
    shortDescription: '',
    description: '',
    features: [],
    specs: [],
    images: [],
    prices: { card: 0, transfer: 0, cod: 0 },
    compareAtPrice: undefined,
    distributorPrice: undefined,
    volumeTiers: [],
    stock: 0,
    isPublished: true,
    isFeatured: false,
    order: 0,
  }
}

function toForm(p: Product): ProductPayload {
  const category = p.category && typeof p.category === 'object' ? p.category._id : p.category || null
  return {
    name: p.name,
    slug: p.slug,
    sku: p.sku || '',
    category,
    shortDescription: p.shortDescription || '',
    description: p.description || '',
    compareAtPrice: p.compareAtPrice,
    distributorPrice: p.distributorPrice,
    stock: p.stock,
    isPublished: p.isPublished,
    isFeatured: p.isFeatured,
    order: p.order || 0,
    features: [...(p.features || [])],
    specs: (p.specs || []).map((s) => ({ ...s })),
    images: [...(p.images || [])],
    prices: { ...p.prices },
    volumeTiers: (p.volumeTiers || []).map((t) => ({ ...t })),
  }
}

/** Estado y guardado del editor de producto (nuevo o existente). */
export function useAdminProductForm(id?: string) {
  const router = useRouter()
  const toast = useToastStore()

  const form = ref<ProductPayload>(blank())
  const categories = ref<Category[]>([])
  const loading = ref(Boolean(id))
  const saving = ref(false)
  const confirmDelete = ref(false)
  // Mientras no se toque el slug a mano, sigue al nombre.
  const slugTouched = ref(Boolean(id))

  watch(
    () => form.value.name,
    (name) => {
      if (!slugTouched.value) form.value.slug = slugify(name)
    },
  )

  async function load() {
    try {
      categories.value = await adminService.categories()
    } catch {
      // Sin categorías el producto igual se puede guardar.
    }
    if (!id) return
    try {
      form.value = toForm(await adminService.product(id))
    } catch (error) {
      toast.error((error as ApiError).message)
    } finally {
      loading.value = false
    }
  }

  const problems = computed(() => {
    const f = form.value
    const list: string[] = []
    if (!f.name.trim()) list.push('Falta el nombre')
    if (!f.slug.trim()) list.push('Falta el slug')
    if (!f.prices.card || !f.prices.transfer || !f.prices.cod) list.push('Faltan precios')
    if (f.prices.card > f.prices.transfer || f.prices.transfer > f.prices.cod) {
      list.push('Revisa los precios: tarjeta debe ser el menor y contra entrega el mayor')
    }
    return list
  })

  function clean(): ProductPayload {
    const f = form.value
    return {
      ...f,
      name: f.name.trim(),
      slug: slugify(f.slug),
      features: f.features.map((x) => x.trim()).filter(Boolean),
      specs: f.specs.filter((s) => s.label.trim() && s.value.trim()),
      volumeTiers: f.volumeTiers
        .filter((t) => t.minQty > 1 && t.unitPrice > 0)
        .sort((a, b) => a.minQty - b.minQty),
      stock: Math.max(0, Math.floor(Number(f.stock) || 0)),
      order: Number(f.order) || 0,
    }
  }

  async function save() {
    // El orden de precios es una advertencia, no un bloqueo; lo demás sí bloquea.
    const blocking = problems.value.filter((p) => !p.startsWith('Revisa'))
    if (blocking.length) {
      toast.error(blocking.join('. '))
      return
    }
    saving.value = true
    try {
      if (id) {
        form.value = toForm(await adminService.updateProduct(id, clean()))
        toast.success('Producto guardado')
      } else {
        const created = await adminService.createProduct(clean())
        toast.success('Producto creado')
        router.replace({ name: 'AdminProductEdit', params: { id: created._id } })
      }
    } catch (error) {
      toast.error((error as ApiError).message)
    } finally {
      saving.value = false
    }
  }

  async function remove() {
    confirmDelete.value = false
    if (!id) return
    try {
      await adminService.deleteProduct(id)
      toast.success('Producto eliminado')
      router.replace({ name: 'AdminProducts' })
    } catch (error) {
      toast.error((error as ApiError).message)
    }
  }

  return { form, categories, loading, saving, confirmDelete, slugTouched, problems, load, save, remove }
}
