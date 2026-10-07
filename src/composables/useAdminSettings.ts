import { ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { AdminSettings, ApiError } from '@/types'

function blank(): AdminSettings {
  return {
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
}

export function useAdminSettings() {
  const toast = useToastStore()
  const form = ref<AdminSettings>(blank())
  const loading = ref(true)
  const saving = ref(false)

  async function load() {
    try {
      form.value = { ...blank(), ...(await adminService.settings()) }
    } catch (error) {
      toast.error((error as ApiError).message)
    } finally {
      loading.value = false
    }
  }

  async function save() {
    // payphoneEnabled depende de las credenciales del servidor: no se edita desde aquí.
    const { payphoneEnabled, ...payload } = form.value
    payload.bankAccounts = payload.bankAccounts.filter((b) => b.bank.trim() && b.number.trim())
    payload.whatsapp = payload.whatsapp.replace(/\s/g, '')
    saving.value = true
    try {
      const saved = await adminService.updateSettings(payload)
      form.value = { ...blank(), ...saved, payphoneEnabled: saved.payphoneEnabled ?? payphoneEnabled }
      toast.success('Ajustes guardados')
    } catch (error) {
      toast.error((error as ApiError).message)
    } finally {
      saving.value = false
    }
  }

  return { form, loading, saving, load, save }
}
