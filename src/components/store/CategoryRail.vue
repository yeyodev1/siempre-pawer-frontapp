<script setup lang="ts">
import { site } from '@/config/site'
import type { Category } from '@/types'

defineProps<{ categories: Category[] }>()
</script>

<template>
  <nav class="rail" aria-label="Categorías">
    <RouterLink v-for="c in categories" :key="c._id" :to="`/tienda/${c.slug}`" class="rail__item">
      <span class="rail__icon">
        <img v-if="c.image" :src="c.image" :alt="''" loading="lazy" />
        <i v-else :class="site.categoryIcons[c.slug] || 'fa-solid fa-medal'"></i>
      </span>
      <span class="rail__name">{{ c.name }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped lang="scss">
// Carrusel horizontal de categorías, como los accesos rápidos de una app de delivery.
.rail {
  @include flex(row, flex-start, flex-start, 1rem);
  overflow-x: auto;
  scrollbar-width: none;
  scroll-snap-type: x proximity;
  padding-block: 0.25rem;

  &::-webkit-scrollbar {
    display: none;
  }

  @include from('md') {
    justify-content: center;
    gap: 1.75rem;
  }

  &__item {
    @include flex(column, center, flex-start, 0.4rem);
    flex: 0 0 auto;
    width: 4.6rem;
    scroll-snap-align: start;
    color: $ink;

    &:hover .rail__icon {
      transform: translateY(-3px);
      border-color: $accent;
    }

    &.router-link-active .rail__icon {
      border-color: $accent;
      background: $accent;
    }
  }

  &__icon {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background: $sand;
    border: 2px solid transparent;
    overflow: hidden;
    @include flex(row, center, center);
    font-size: 1.6rem;
    @include transition(transform);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__name {
    font-family: $font-condensed;
    font-weight: 700;
    font-size: 0.82rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    text-align: center;
    line-height: 1.1;
  }
}
</style>
