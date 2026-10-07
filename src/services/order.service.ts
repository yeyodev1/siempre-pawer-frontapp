import APIBase from './httpBase'
import type {
  CreateOrderPayload,
  CreateOrderResponse,
  Order,
  PaymentMethod,
  Quote,
  ShippingMethod,
} from '@/types'

export interface QuotePayload {
  items: { productId: string; qty: number }[]
  paymentMethod: PaymentMethod
  couponCode?: string
  shippingMethod: ShippingMethod
}

class OrderService extends APIBase {
  async quote(payload: QuotePayload): Promise<Quote> {
    const { data } = await this.post<Quote>('orders/quote', payload)
    return data
  }

  async validateCoupon(code: string): Promise<{ code: string; discountPct: number }> {
    const { data } = await this.post<{ code: string; discountPct: number }>('coupons/validate', { code })
    return data
  }

  async create(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    const { data } = await this.post<CreateOrderResponse>('orders', payload)
    return data
  }

  async confirm(id: string, clientTransactionId: string): Promise<Order> {
    const { data } = await this.post<Order>('orders/confirm', { id, clientTransactionId })
    return data
  }

  async track(number: string, email: string): Promise<Order> {
    const { data } = await this.get<Order>(
      `orders/track/${encodeURIComponent(number)}?email=${encodeURIComponent(email)}`,
    )
    return data
  }

  async uploadReceipt(number: string, email: string, file: File): Promise<Order> {
    const form = new FormData()
    form.append('file', file)
    const { data } = await this.post<Order>(
      `orders/track/${encodeURIComponent(number)}/receipt?email=${encodeURIComponent(email)}`,
      form,
      undefined,
      { timeout: 60000 },
    )
    return data
  }
}

export const orderService = new OrderService()
