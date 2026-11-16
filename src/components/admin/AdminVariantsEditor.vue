<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ProductVariant } from '@/types'

const variants = defineModel<ProductVariant[]>({ default: () => [] })

// Texto libre, una talla por línea: "8/10: Negro, Blanco". Es lo más rápido de llenar desde el celular.
function toText(list: ProductVariant[]): string {
  return list.map((v) => (v.colors.length ? `${v.size}: ${v.colors.join(', ')}` : v.size)).join('\n')
}

function parse(text: string): ProductVariant[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [size = '', colors = ''] = line.includes(':') ? line.split(/:(.*)/s) : [line, '']
      return { size: size.trim(), colors: colors.split(',').map((c) => c.trim()).filter(Boolean) }
    })
    .filter((v) => v.size || v.colors.length)
}

const text = ref(toText(variants.value || []))
watch(variants, (list) => {
  if (toText(list || []) !== toText(parse(text.value))) text.value = toText(list || [])
})
watch(text, (value) => (variants.value = parse(value)))
</script>

<template>
  <div class="adm-field">
    <label for="p-variants">Tallas y colores</label>
    <textarea id="p-variants" v-model="text" rows="4" :placeholder="'8/10: Negro, Blanco\n10/12: Negro, Blanco, Blanco con negro'"></textarea>
    <small>
      Una talla por línea con sus colores después de los dos puntos. Solo colores: <code>: Negro, Blanco</code>.
      Vacío si el producto no tiene opciones. El stock es uno solo para todas.
    </small>
  </div>
</template>
