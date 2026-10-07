import { ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError } from '@/types'

const MAX_MB = 8

/** Sube archivos a Cloudinary vía /admin/uploads, de a uno para no saturar la conexión móvil. */
export function useAdminUpload() {
  const toast = useToastStore()
  const uploading = ref(0)

  async function uploadFiles(files: FileList | File[]): Promise<string[]> {
    const urls: string[] = []
    const list = Array.from(files)
    uploading.value = list.length
    for (const file of list) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} no es una imagen`)
      } else if (file.size > MAX_MB * 1024 * 1024) {
        toast.error(`${file.name} pesa más de ${MAX_MB} MB`)
      } else {
        try {
          urls.push(await adminService.upload(file))
        } catch (error) {
          toast.error((error as ApiError).message)
        }
      }
      uploading.value -= 1
    }
    uploading.value = 0
    return urls
  }

  return { uploading, uploadFiles }
}
