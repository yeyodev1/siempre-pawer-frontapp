<script setup lang="ts">
import type { Category } from '@/types'

defineProps<{ categories: Category[] }>()
</script>

<template>
  <div class="tiles">
    <RouterLink v-for="c in categories" :key="c._id" :to="`/tienda/${c.slug}`" class="tile">
      <img v-if="c.image" :src="c.image" :alt="c.name" loading="lazy" class="tile__img" />
      <span class="tile__shade"></span>
      <span class="tile__name">{{ c.name }}</span>
      <i class="fa-solid fa-arrow-right tile__arrow"></i>
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
.tiles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tile {
  position: relative;
  // Columnas fijas: con flex-cards la última categoría se estiraba a lo ancho.
  flex: 0 0 calc((100% - 0.75rem) / 2);
  min-width: 0;
  aspect-ratio: 1;
  background: $ink;

  @include from('md') {
    flex: 1 1 0;
    aspect-ratio: 3 / 4;
  }
  overflow: hidden;
  @include flex(column, flex-start, flex-end);
  padding: 1rem;
  color: $paper;

  // Sin foto de categoría queda el rayo de marca como textura.
  &::before {
    content: '';
    position: absolute;
    top: -10%;
    bottom: -10%;
    right: 12%;
    width: 22%;
    background: rgba($accent, 0.16);
    transform: skewX(-18deg);
  }

  &__img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s $ease;
  }

  &__shade {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 40%, rgba($night, 0.85));
  }

  &__name {
    position: relative;
    font-family: $font-display;
    font-size: clamp(1.6rem, 1.2rem + 1.5vw, 2.4rem);
    line-height: 0.95;
    text-transform: uppercase;
  }

  &__arrow {
    position: relative;
    margin-top: 0.5rem;
    width: 2rem;
    height: 2rem;
    background: $accent;
    color: $on-accent;
    @include flex(row, center, center);
    font-size: 0.85rem;
    transform: skewX(-12deg);
    @include transition(transform);
  }

  &:hover &__img {
    transform: scale(1.07);
  }

  &:hover &__arrow {
    transform: skewX(-12deg) translateX(6px);
  }
}
</style>
