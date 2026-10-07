import APIBase from './httpBase'
import type {
  AdminSettings,
  AdminStats,
  Category,
  Coupon,
  Distributor,
  Order,
  OrderStatus,
  Paginated,
  Product,
} from '@/types'

export interface AdminOrderQuery {
  status?: OrderStatus | ''
  search?: string
  page?: number
}

export interface AdminProductQuery {
  search?: string
  category?: string
  page?: number
}

export interface AdminOrderPatch {
  status?: OrderStatus
  trackingNumber?: string
  trackingUrl?: string
  notes?: string
  /** Comentario que queda en el historial junto al cambio de estado. */
  note?: string
}

export type ProductPayload = Omit<Product, '_id' | 'related' | 'createdAt' | 'category'> & {
  category: string | null
}
export type CategoryPayload = Omit<Category, '_id'>
export type CouponPayload = Omit<Coupon, '_id' | 'uses' | 'salesTotal' | 'commissionTotal'>
export type DistributorPayload = Omit<Distributor, '_id' | 'createdAt'> & { password?: string }

/** Arma el query string omitiendo vacíos, para no mandar `status=` al API. */
function qs(params: object): string {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value))
  })
  const out = search.toString()
  return out ? `?${out}` : ''
}

/** Las listas cortas pueden venir como arreglo o paginadas: acepta ambas. */
function asList<T>(data: T[] | Paginated<T>): T[] {
  return Array.isArray(data) ? data : data?.items || []
}

class AdminService extends APIBase {
  async stats(): Promise<AdminStats> {
    return (await this.get<AdminStats>('admin/stats')).data
  }

  // Pedidos
  async orders(query: AdminOrderQuery = {}): Promise<Paginated<Order>> {
    return (await this.get<Paginated<Order>>(`admin/orders${qs(query)}`)).data
  }

  async order(id: string): Promise<Order> {
    return (await this.get<Order>(`admin/orders/${id}`)).data
  }

  async updateOrder(id: string, patch: AdminOrderPatch): Promise<Order> {
    return (await this.patch<Order>(`admin/orders/${id}`, patch)).data
  }

  // Productos
  async products(query: AdminProductQuery = {}): Promise<Paginated<Product>> {
    return (await this.get<Paginated<Product>>(`admin/products${qs(query)}`)).data
  }

  async product(id: string): Promise<Product> {
    return (await this.get<Product>(`admin/products/${id}`)).data
  }

  async createProduct(payload: ProductPayload): Promise<Product> {
    return (await this.post<Product>('admin/products', payload)).data
  }

  async updateProduct(id: string, payload: Partial<ProductPayload>): Promise<Product> {
    return (await this.put<Product>(`admin/products/${id}`, payload)).data
  }

  async deleteProduct(id: string): Promise<void> {
    await this.delete(`admin/products/${id}`)
  }

  async upload(file: File): Promise<string> {
    const form = new FormData()
    form.append('file', file)
    // Las fotos del celular pesan: más margen que el timeout por defecto.
    const { data } = await this.post<{ url: string }>('admin/uploads', form, undefined, {
      timeout: 60000,
    })
    return data.url
  }

  // Categorías
  async categories(): Promise<Category[]> {
    return asList((await this.get<Category[] | Paginated<Category>>('admin/categories')).data)
  }

  async createCategory(payload: CategoryPayload): Promise<Category> {
    return (await this.post<Category>('admin/categories', payload)).data
  }

  async updateCategory(id: string, payload: Partial<CategoryPayload>): Promise<Category> {
    return (await this.put<Category>(`admin/categories/${id}`, payload)).data
  }

  async deleteCategory(id: string): Promise<void> {
    await this.delete(`admin/categories/${id}`)
  }

  // Cupones
  async coupons(): Promise<Coupon[]> {
    return asList((await this.get<Coupon[] | Paginated<Coupon>>('admin/coupons')).data)
  }

  async createCoupon(payload: CouponPayload): Promise<Coupon> {
    return (await this.post<Coupon>('admin/coupons', payload)).data
  }

  async updateCoupon(id: string, payload: Partial<CouponPayload>): Promise<Coupon> {
    return (await this.put<Coupon>(`admin/coupons/${id}`, payload)).data
  }

  async deleteCoupon(id: string): Promise<void> {
    await this.delete(`admin/coupons/${id}`)
  }

  // Distribuidores
  async distributors(): Promise<Distributor[]> {
    return asList((await this.get<Distributor[] | Paginated<Distributor>>('admin/distributors')).data)
  }

  async createDistributor(payload: DistributorPayload): Promise<Distributor> {
    return (await this.post<Distributor>('admin/distributors', payload)).data
  }

  async updateDistributor(id: string, payload: Partial<DistributorPayload>): Promise<Distributor> {
    return (await this.put<Distributor>(`admin/distributors/${id}`, payload)).data
  }

  async deleteDistributor(id: string): Promise<void> {
    await this.delete(`admin/distributors/${id}`)
  }

  // Ajustes
  async settings(): Promise<AdminSettings> {
    return (await this.get<AdminSettings>('admin/settings')).data
  }

  async updateSettings(payload: Omit<AdminSettings, 'payphoneEnabled'>): Promise<AdminSettings> {
    return (await this.put<AdminSettings>('admin/settings', payload)).data
  }
}

export const adminService = new AdminService()
