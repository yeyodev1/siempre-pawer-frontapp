<script setup lang="ts">
import ProductCard from './ProductCard.vue'
import type { Product } from '@/types'

defineProps<{ products: Product[] }>()
</script>

<template>
  <div class="grid">
    <ProductCard v-for="p in products" :key="p._id" :product="p" class="grid__item" />
  </div>
</template>

<style scoped lang="scss">
// Columnas fijas con flex-wrap: 2 en móvil, 3 en tablet, 4 en escritorio.
// flex-cards estira la última fila; en un catálogo eso deforma las fotos.
.grid {
  $gap: 0.9rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.75rem $gap;

  &__item {
    flex: 0 0 calc((100% - #{$gap}) / 2);
    min-width: 0;

    @include from('md') {
      flex-basis: calc((100% - #{$gap} * 2) / 3);
    }

    @include from('lg') {
      flex-basis: calc((100% - #{$gap} * 3) / 4);
    }
  }
}
</style>
