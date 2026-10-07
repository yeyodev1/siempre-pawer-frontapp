<script setup lang="ts">
defineProps<{ eyebrow?: string; title: string; dark?: boolean; as?: 'h1' | 'h2' }>()
</script>

<template>
  <div class="head" :class="{ 'head--dark': dark }">
    <span v-if="eyebrow" class="head__eyebrow">{{ eyebrow }}</span>
    <component :is="as || 'h2'" class="head__title">{{ title }}</component>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.head {
  @include flex(column, flex-start, flex-start, 0.6rem);

  // La firma de la marca: una etiqueta dorada inclinada, como el rayo del logo.
  &__eyebrow {
    display: inline-block;
    font-family: $font-condensed;
    font-weight: 700;
    font-size: 0.8rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    background: $accent;
    color: $on-accent;
    padding: 0.2rem 0.75rem;
    transform: skewX(-12deg);
  }

  &__title {
    font-family: $font-display;
    font-weight: 400;
    font-size: $display-md;
    line-height: 0.95;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    color: $ink;
  }

  &--dark &__title {
    color: $paper;
  }
}
</style>
