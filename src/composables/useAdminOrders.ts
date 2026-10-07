import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Order, OrderStatus } from '@/types'

/** Lista de pedidos con filtros. El estado vive en la URL para que "atrás" desde el detalle lo conserve. */
export function useAdminOrders() {
  const route = useRoute()
  const router = useRouter()
  const toast = useToastStore()

  const status = ref<OrderStatus | ''>((route.query.status as OrderStatus | undefined) || '')
  const search = ref((route.query.search as string) || '')
  const page = ref(Number(route.query.page) || 1)

  const orders = ref<Order[]>([])
  const total = ref(0)
  const pages = ref(1)
  const loading = ref(false)

  async function load() {
    loading.value = true
    try {
      const result = await adminService.orders({
        status: status.value,
        search: search.value.trim(),
        page: page.value,
      })
      orders.value = result.items
      total.value = result.total
      pages.value = result.pages || 1
    } catch (error) {
      toast.error((error as ApiError).message)
    } finally {
      loading.value = false
    }
  }

  function syncQuery() {
    router.replace({
      query: {
        ...(status.value ? { status: status.value } : {}),
        ...(search.value.trim() ? { search: search.value.trim() } : {}),
        ...(page.value > 1 ? { page: String(page.value) } : {}),
      },
    })
  }

  let timer: ReturnType<typeof setTimeout> | undefined
  watch(search, () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      page.value = 1
      syncQuery()
      load()
    }, 350)
  })

  watch(status, () => {
    page.value = 1
    syncQuery()
    load()
  })

  function goTo(next: number) {
    page.value = next
    syncQuery()
    load()
  }

  return { status, search, page, pages, total, orders, loading, load, goTo }
}
