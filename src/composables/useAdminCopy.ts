import { useToastStore } from '@/stores/toast'

/** Copia al portapapeles con aviso. El fallback cubre http en el celular (sin Clipboard API). */
export function useAdminCopy() {
  const toast = useToastStore()

  async function copy(text: string, label = 'Copiado') {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        const area = document.createElement('textarea')
        area.value = text
        area.style.position = 'fixed'
        area.style.opacity = '0'
        document.body.appendChild(area)
        area.select()
        document.execCommand('copy')
        area.remove()
      }
      toast.success(label)
    } catch {
      toast.error('No se pudo copiar, selecciónalo a mano')
    }
  }

  return { copy }
}
