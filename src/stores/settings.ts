import { defineStore } from 'pinia'
import { settingsService } from '@/services/settings.service'
import type { PaymentMethod, PublicSettings } from '@/types'

// Mientras el API no responde: sin tarjeta (requiere config del servidor) y
// con los otros dos métodos encendidos, que son los que no dependen de nada.
const defaults: PublicSettings = {
  shippingCost: 0,
  freeShippingFrom: 0,
  pickupAddress: '',
  bankAccounts: [],
  whatsapp: '',
  announcement: '',
  codEnabled: true,
  transferEnabled: true,
  payphoneEnabled: false,
}

let pending: Promise<void> | null = null

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: { ...defaults } as PublicSettings,
    loaded: false,
  }),

  getters: {
    /** Métodos habilitados en orden de conveniencia para el cliente. */
    paymentMethods(s): PaymentMethod[] {
      const list: PaymentMethod[] = []
      if (s.settings.payphoneEnabled) list.push('card')
      if (s.settings.transferEnabled) list.push('transfer')
      if (s.settings.codEnabled) list.push('cod')
      return list
    },
  },

  actions: {
    load(): Promise<void> {
      if (this.loaded) return Promise.resolve()
      if (pending) return pending
      pending = settingsService
        .getPublic()
        .then((data) => {
          this.settings = { ...defaults, ...data }
          this.loaded = true
        })
        .catch(() => {
          /* se queda con los valores por defecto y reintenta en la próxima carga */
        })
        .finally(() => {
          pending = null
        })
      return pending
    },
  },
})
