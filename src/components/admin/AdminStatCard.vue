<script setup lang="ts">
defineProps<{ label: string; value: string | number; icon: string; to?: object; tone?: 'gold' | 'warn' }>()
</script>

<template>
  <component :is="to ? 'RouterLink' : 'div'" :to="to" class="stat" :class="tone && `stat--${tone}`">
    <span class="stat__icon"><i :class="icon"></i></span>
    <span class="stat__label">{{ label }}</span>
    <strong class="stat__value">{{ value }}</strong>
  </component>
</template>

<style scoped lang="scss">
.stat {
  @include card;
  border-radius: $radius-sm;
  @include flex(column, flex-start, flex-start, 0.2rem);
  padding: 1rem 1.1rem;
  position: relative;
  @include transition(border-color);

  &[href]:hover {
    border-color: $ink;
  }

  &__icon {
    position: absolute;
    top: 0.9rem;
    right: 1rem;
    color: $ink-muted;
  }

  &__label {
    font-family: $font-condensed;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: $ink-muted;
  }

  &__value {
    font-family: $font-display;
    font-size: 2.2rem;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.02em;
  }

  &--gold {
    background: $night;
    border-color: $night;

    .stat__value {
      color: $accent;
    }
  }

  &--warn .stat__icon {
    color: $danger;
  }
}
</style>
