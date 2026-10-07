import { ref, type Ref } from 'vue'
import { useToastStore } from '@/stores/toast'
import type { ApiError } from '@/types'

interface CrudOptions<T extends { _id: string }, F> {
  list: () => Promise<T[]>
  create: (form: F) => Promise<T>
  update: (id: string, form: F) => Promise<T>
  remove: (id: string) => Promise<void>
  /** Formulario vacío para "Nuevo". */
  blank: () => F
  /** Pasa un registro existente al formulario de edición. */
  toForm: (item: T) => F
  /** Validación local antes de llamar al API; devuelve el mensaje de error o null. */
  validate?: (form: F, editingId: string | null) => string | null
  noun: string
}

/**
 * Estado de las pantallas CRUD simples (categorías, cupones, distribuidores):
 * lista, hoja de edición y confirmación de borrado.
 */
export function useAdminCrud<T extends { _id: string }, F>(options: CrudOptions<T, F>) {
  const toast = useToastStore()

  const items = ref([]) as Ref<T[]>
  const loading = ref(false)
  const saving = ref(false)
  const sheetOpen = ref(false)
  const editingId = ref<string | null>(null)
  const form = ref(options.blank()) as Ref<F>
  const toDelete = ref(null) as Ref<T | null>

  async function load() {
    loading.value = true
    try {
      items.value = await options.list()
    } catch (error) {
      toast.error((error as ApiError).message)
    } finally {
      loading.value = false
    }
  }

  function openNew() {
    editingId.value = null
    form.value = options.blank()
    sheetOpen.value = true
  }

  function openEdit(item: T) {
    editingId.value = item._id
    form.value = options.toForm(item)
    sheetOpen.value = true
  }

  async function save() {
    const problem = options.validate?.(form.value, editingId.value)
    if (problem) {
      toast.error(problem)
      return
    }
    saving.value = true
    try {
      if (editingId.value) {
        const updated = await options.update(editingId.value, form.value)
        items.value = items.value.map((it) => (it._id === updated._id ? updated : it))
        toast.success(`${options.noun} actualizado`)
      } else {
        const created = await options.create(form.value)
        items.value = [created, ...items.value]
        toast.success(`${options.noun} creado`)
      }
      sheetOpen.value = false
    } catch (error) {
      toast.error((error as ApiError).message)
    } finally {
      saving.value = false
    }
  }

  async function confirmDelete() {
    const target = toDelete.value
    if (!target) return
    toDelete.value = null
    try {
      await options.remove(target._id)
      items.value = items.value.filter((it) => it._id !== target._id)
      toast.success(`${options.noun} eliminado`)
    } catch (error) {
      toast.error((error as ApiError).message)
    }
  }

  /** Cambio rápido de un campo (ej. activo) sin abrir la hoja. */
  async function patch(item: T, changes: Partial<F>) {
    try {
      const updated = await options.update(item._id, { ...options.toForm(item), ...changes })
      items.value = items.value.map((it) => (it._id === updated._id ? updated : it))
    } catch (error) {
      toast.error((error as ApiError).message)
    }
  }

  return {
    items,
    loading,
    saving,
    sheetOpen,
    editingId,
    form,
    toDelete,
    load,
    openNew,
    openEdit,
    save,
    confirmDelete,
    patch,
  }
}
