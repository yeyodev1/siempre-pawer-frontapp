<script setup lang="ts">
defineProps<{ title: string; subtitle?: string; back?: string }>()
</script>

<template>
  <header class="page-head">
    <div class="page-head__text">
      <RouterLink v-if="back" :to="back" class="page-head__back">
        <i class="fa-solid fa-arrow-left"></i> Volver
      </RouterLink>
      <h1 class="page-head__title">{{ title }}</h1>
      <p v-if="subtitle" class="page-head__subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.default" class="page-head__actions">
      <slot />
    </div>
  </header>
</template>

<style scoped lang="scss">
.page-head {
  @include flex(row, flex-end, space-between, 0.8rem);
  flex-wrap: wrap;
  margin-bottom: 1.25rem;

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    margin-bottom: 0.3rem;

    &:hover {
      color: $ink;
    }
  }

  &__title {
    font-family: $font-display;
    font-size: $display-sm;
    letter-spacing: 0.02em;
    line-height: 1;
  }

  &__subtitle {
    color: $ink-muted;
    font-size: $text-sm;
    margin-top: 0.25rem;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }
}
</style>
