import APIBase from './httpBase'
import type { Category, Paginated, Product } from '@/types'

export interface ProductQuery {
  category?: string
  search?: string
  featured?: boolean
  sort?: 'newest' | 'price_asc' | 'price_desc'
  page?: number
  limit?: number
}

class CatalogService extends APIBase {
  async categories(): Promise<Category[]> {
    const { data } = await this.get<Category[]>('categories')
    return Array.isArray(data) ? data : []
  }

  async products(query: ProductQuery = {}): Promise<Paginated<Product>> {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== false) params.set(key, String(value))
    })
    const qs = params.toString()
    const { data } = await this.get<Paginated<Product>>(`products${qs ? `?${qs}` : ''}`)
    return { items: data.items || [], total: data.total || 0, page: data.page || 1, pages: data.pages || 1 }
  }

  async product(slug: string): Promise<Product> {
    const { data } = await this.get<Product>(`products/${encodeURIComponent(slug)}`)
    return data
  }
}

export const catalogService = new CatalogService()
