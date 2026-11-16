import { reactive, ref, watch } from 'vue'
import { catalogService } from '@/services/catalog.service'
import { schoolQuoteService, type SchoolQuoteItem } from '@/services/schoolQuote.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Product } from '@/types'

export function useSchoolQuote() {
  const toast = useToastStore()

  const mode = ref<'build' | 'upload'>('build')
  const term = ref('')
  const results = ref<Product[]>([])
  const searching = ref(false)
  const items = ref<SchoolQuoteItem[]>([])
  const custom = ref('')
  const file = ref<File | null>(null)
  const form = reactive({ institution: '', name: '', email: '', phone: '', city: '', notes: '' })
  const sending = ref(false)
  const sent = ref(false)

  // Búsqueda con espera corta para no pedir al API en cada tecla.
  let timer: ReturnType<typeof setTimeout> | undefined
  let request = 0
  watch(term, (value) => {
    clearTimeout(timer)
    const search = value.trim()
    if (search.length < 2) {
      results.value = []
      return
    }
    timer = setTimeout(async () => {
      const id = ++request
      searching.value = true
      try {
        const { items: found } = await catalogService.products({ search, limit: 6 })
        if (id === request) results.value = found
      } catch {
        if (id === request) results.value = []
      } finally {
        if (id === request) searching.value = false
      }
    }, 300)
  })

  function addProduct(p: Product) {
    const existing = items.value.find((i) => i.product === p._id)
    if (existing) existing.qty += 1
    else items.value.push({ product: p._id, name: p.name, qty: 1 })
    term.value = ''
  }

  function addCustom() {
    const name = custom.value.trim()
    if (!name) return
    items.value.push({ product: '', name, qty: 1 })
    custom.value = ''
  }

  function removeItem(index: number) {
    items.value.splice(index, 1)
  }

  function pickFile(event: Event) {
    file.value = (event.target as HTMLInputElement).files?.[0] || null
  }

  async function submit() {
    if (sending.value) return
    sending.value = true
    try {
      await schoolQuoteService.create(form, items.value, file.value)
      sent.value = true
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e) {
      toast.error((e as ApiError).message || 'No pudimos enviar tu solicitud. Inténtalo de nuevo.')
    } finally {
      sending.value = false
    }
  }

  return {
    mode, term, results, searching, items, custom, file, form, sending, sent,
    addProduct, addCustom, removeItem, pickFile, submit,
  }
}
