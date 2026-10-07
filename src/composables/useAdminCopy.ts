import { useToastStore } from '@/stores/toast'

// Respaldo para http en el celular o cuando el navegador niega el permiso del portapapeles.
function legacyCopy(text: string): boolean {
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  const ok = document.execCommand('copy')
  area.remove()
  return ok
}

/** Copia al portapapeles con aviso. */
export function useAdminCopy() {
  const toast = useToastStore()

  async function copy(text: string, label = 'Copiado') {
    let ok = false
    try {
      await navigator.clipboard.writeText(text)
      ok = true
    } catch {
      ok = legacyCopy(text)
    }
    if (ok) toast.success(label)
    else toast.error(`No se pudo copiar: ${text}`)
  }

  return { copy }
}
