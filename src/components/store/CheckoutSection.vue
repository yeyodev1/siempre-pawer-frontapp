<script setup lang="ts">
defineProps<{ title: string; icon?: string }>()
</script>

<template>
  <section class="section">
    <h2 class="section__title">
      <i v-if="icon" :class="icon"></i>
      {{ title }}
    </h2>
    <div class="section__body">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.section {
  @include flex(column, stretch, flex-start, 1rem);
  padding-block: 1.5rem;
  border-top: 2px solid $ink;

  &__title {
    font-family: $font-display;
    font-weight: 400;
    font-size: 1.9rem;
    text-transform: uppercase;
    line-height: 1;
    @include flex(row, center, flex-start, 0.6rem);

    i {
      font-size: 1rem;
      width: 2rem;
      height: 2rem;
      background: $accent;
      color: $on-accent;
      @include flex(row, center, center);
      transform: skewX(-12deg);
    }
  }

  // Campos del formulario: los usan todas las secciones del checkout.
  &__body {
    display: flex;
    flex-wrap: wrap;
    gap: 0.9rem;
  }

  :slotted(.field) {
    flex: 1 1 100%;
    min-width: 0;
  }

  :slotted(.field--half) {
    @include from('sm') {
      flex: 1 1 calc(50% - 0.45rem);
    }
  }

  :slotted(.hint) {
    flex: 1 1 100%;
    font-size: $text-xs;
    color: $ink-soft;
  }
}
</style>
