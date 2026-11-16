import APIBase from './httpBase'

export interface SchoolQuoteItem {
  product: string
  name: string
  qty: number
}

export interface SchoolQuoteForm {
  institution: string
  name: string
  email: string
  phone: string
  city: string
  notes: string
}

class SchoolQuoteService extends APIBase {
  async create(form: SchoolQuoteForm, items: SchoolQuoteItem[], file: File | null): Promise<void> {
    const data = new FormData()
    Object.entries(form).forEach(([key, value]) => data.append(key, value))
    data.append('items', JSON.stringify(items))
    if (file) data.append('file', file)
    await this.post('school-quotes', data)
  }
}

export const schoolQuoteService = new SchoolQuoteService()
