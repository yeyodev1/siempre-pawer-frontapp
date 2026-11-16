<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  text?: string
  cta: string
  to: string
  icon?: string
  light?: boolean
}>()
</script>

<template>
  <RouterLink :to="to" class="promo" :class="{ 'promo--light': light }">
    <div class="promo__copy">
      <span class="promo__eyebrow">{{ eyebrow }}</span>
      <strong class="promo__title">{{ title }}</strong>
      <span v-if="text" class="promo__text">{{ text }}</span>
      <span class="promo__cta">{{ cta }} <i class="fa-solid fa-arrow-right"></i></span>
    </div>
    <i v-if="icon" :class="icon" class="promo__icon" aria-hidden="true"></i>
  </RouterLink>
</template>

<style scoped lang="scss">
.promo {
  position: relative;
  overflow: hidden;
  @include flex(row, center, space-between, 1rem);
  background: $night;
  color: $paper;
  padding: 1.5rem 1.25rem;
  border-radius: 12px;

  @include from('md') {
    padding: 2.25rem 2.5rem;
  }

  &--light {
    background: $accent;
    color: $on-accent;
  }

  &__copy {
    position: relative;
    z-index: 1;
    @include flex(column, flex-start, flex-start, 0.35rem);
    max-width: 34ch;
  }

  &__eyebrow {
    font-family: $font-condensed;
    font-weight: 700;
    font-size: 0.8rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: $accent;
  }

  &--light &__eyebrow {
    color: $ink;
  }

  &__title {
    font-family: $font-display;
    font-weight: 400;
    font-style: italic;
    font-size: clamp(1.7rem, 1.2rem + 2vw, 2.8rem);
    line-height: 0.95;
    text-transform: uppercase;
  }

  &__text {
    font-size: $text-sm;
    opacity: 0.8;
  }

  &__cta {
    margin-top: 0.6rem;
    background: $accent;
    color: $on-accent;
    font-family: $font-condensed;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.5rem 1rem;
    border-radius: 6px;

    i {
      margin-left: 0.3rem;
      font-size: 0.8em;
      @include transition(transform);
    }
  }

  &--light &__cta {
    background: $ink;
    color: $paper;
  }

  &:hover &__cta i {
    transform: translateX(4px);
  }

  &__icon {
    font-size: 5.5rem;
    opacity: 0.18;
    transform: rotate(-12deg);
    position: absolute;
    right: -0.5rem;
    bottom: -0.75rem;

    @include from('md') {
      position: static;
      font-size: 7rem;
      opacity: 0.9;
      color: $accent;
    }
  }

  &--light &__icon {
    color: $ink;
  }
}
</style>
