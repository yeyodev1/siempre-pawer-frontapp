<script setup lang="ts">
import { ref } from 'vue'
import { useAdminUpload } from '@/composables/useAdminUpload'

const images = defineModel<string[]>({ default: () => [] })
const props = defineProps<{ multiple?: boolean; label?: string }>()

const { uploading, uploadFiles } = useAdminUpload()
const input = ref<HTMLInputElement | null>(null)

async function onPick(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files?.length) return
  const urls = await uploadFiles(files)
  images.value = props.multiple ? [...images.value, ...urls] : urls.slice(0, 1)
  if (input.value) input.value.value = ''
}

function move(index: number, delta: number) {
  const next = [...images.value]
  const target = index + delta
  if (target < 0 || target >= next.length) return
  const [item] = next.splice(index, 1)
  if (item !== undefined) next.splice(target, 0, item)
  images.value = next
}

function remove(index: number) {
  images.value = images.value.filter((_, i) => i !== index)
}
</script>

<template>
  <div class="uploader">
    <span v-if="label" class="uploader__label">{{ label }}</span>
    <ul class="uploader__list">
      <li v-for="(src, i) in images" :key="src + i" class="uploader__item">
        <img :src="src" alt="" loading="lazy" />
        <span v-if="multiple && i === 0" class="uploader__badge">Principal</span>
        <div class="uploader__tools">
          <button v-if="multiple" type="button" aria-label="Mover a la izquierda" :disabled="i === 0" @click="move(i, -1)">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <button type="button" aria-label="Quitar imagen" @click="remove(i)">
            <i class="fa-solid fa-trash-can"></i>
          </button>
          <button v-if="multiple" type="button" aria-label="Mover a la derecha" :disabled="i === images.length - 1" @click="move(i, 1)">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </li>
      <li v-if="multiple || !images.length" class="uploader__item uploader__item--add">
        <button type="button" :disabled="uploading > 0" @click="input?.click()">
          <i :class="uploading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-camera'"></i>
          <span>{{ uploading ? `Subiendo ${uploading}...` : multiple ? 'Agregar fotos' : 'Subir foto' }}</span>
        </button>
      </li>
    </ul>
    <input ref="input" type="file" accept="image/*" :multiple="multiple" hidden @change="onPick" />
  </div>
</template>

<style scoped lang="scss">
.uploader {
  &__label {
    display: block;
    font-size: 0.82rem;
    font-weight: 600;
    color: $ink-soft;
    margin-bottom: 0.35rem;
  }

  &__list {
    list-style: none;
    @include flex(row, stretch, flex-start, 0.6rem);
    flex-wrap: wrap;
  }

  &__item {
    position: relative;
    width: 104px;
    height: 104px;
    border-radius: $radius-sm;
    overflow: hidden;
    border: 1px solid $line;
    background: $sand;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &--add {
      border-style: dashed;
      border-width: 2px;

      button {
        width: 100%;
        height: 100%;
        @include flex(column, center, center, 0.3rem);
        font-size: 0.72rem;
        font-weight: 600;
        color: $ink-soft;
        text-align: center;
        padding: 0.4rem;

        i {
          font-size: 1.2rem;
        }
      }
    }
  }

  &__badge {
    position: absolute;
    top: 4px;
    left: 4px;
    background: $ink;
    color: $accent;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
  }

  &__tools {
    position: absolute;
    inset: auto 0 0 0;
    @include flex(row, center, space-between);
    background: rgba($ink, 0.72);

    button {
      flex: 1;
      color: $surface;
      padding: 0.35rem 0;
      font-size: 0.75rem;

      &:disabled {
        opacity: 0.3;
      }
    }
  }
}
</style>
