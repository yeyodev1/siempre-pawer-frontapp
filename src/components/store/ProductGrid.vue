<script setup lang="ts">
import ProductCard from './ProductCard.vue'
import type { Product } from '@/types'

// dense: 3 columnas en el celular, para vitrinas cortas como "Los más vendidos".
defineProps<{ products: Product[]; dense?: boolean }>()
</script>

<template>
  <div class="grid" :class="{ 'grid--dense': dense }">
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

  &--dense {
    gap: 1.25rem 0.6rem;
  }

  // Tarjetas chicas: precio y botón más compactos para que quepan en 3 columnas.
  &--dense :deep(.card__price strong) {
    font-size: 1.3rem;
  }

  &--dense :deep(.card__price span) {
    display: none;
  }

  &--dense :deep(.card__add) {
    width: 2.1rem;
    height: 2.1rem;
    font-size: 0.95rem;
  }

  &--dense &__item {
    @include until('md') {
      flex-basis: calc((100% - 1.2rem) / 3);
    }

    @include from('lg') {
      flex-basis: calc((100% - #{$gap} * 5) / 6);
    }
  }
}
</style>
