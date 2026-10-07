<script setup lang="ts">
import type { ProductSpec } from '@/types'

const specs = defineModel<ProductSpec[]>({ default: () => [] })

function add() {
  specs.value = [...specs.value, { label: '', value: '' }]
}

function remove(index: number) {
  specs.value = specs.value.filter((_, i) => i !== index)
}
</script>

<template>
  <div class="specs">
    <span class="specs__label">Especificaciones</span>
    <ul v-if="specs.length" class="specs__list">
      <li v-for="(spec, i) in specs" :key="i" class="specs__row">
        <input v-model="spec.label" placeholder="Ej. Tamaño" :aria-label="`Nombre de la especificación ${i + 1}`" />
        <input v-model="spec.value" placeholder="Ej. N.º 5" :aria-label="`Valor de la especificación ${i + 1}`" />
        <button type="button" class="adm-btn adm-btn--ghost adm-btn--icon" aria-label="Quitar" @click="remove(i)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </li>
    </ul>
    <button type="button" class="adm-btn adm-btn--ghost adm-btn--sm" @click="add">
      <i class="fa-solid fa-plus"></i> Agregar especificación
    </button>
  </div>
</template>

<style scoped lang="scss">
.specs {
  &__label {
    display: block;
    font-size: 0.82rem;
    font-weight: 600;
    color: $ink-soft;
    margin-bottom: 0.35rem;
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.45rem);
    margin-bottom: 0.6rem;
  }

  &__row {
    @include flex(row, center, flex-start, 0.4rem);

    input {
      flex: 1 1 0;
      min-width: 0;
    }
  }
}
</style>
