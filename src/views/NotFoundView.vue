<script setup lang="ts">
import { copy } from '@/config/copy'

const t = copy.notFound
</script>

<template>
  <section class="nf">
    <p class="nf__code" aria-hidden="true">{{ t.code }}</p>
    <h1 class="nf__title">{{ t.title }}</h1>
    <p class="nf__text">{{ t.text }}</p>
    <div class="nf__actions">
      <RouterLink to="/" class="btn btn--dark btn--sport btn--lg">{{ t.cta }}</RouterLink>
      <RouterLink to="/tienda" class="btn btn--primary btn--sport btn--lg">{{ copy.shop.title }}</RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.nf {
  @include container(640px);
  flex: 1;
  @include flex(column, center, center, 0.9rem);
  text-align: center;
  padding-block: $space-xl;

  &__code {
    font-family: $font-display;
    font-size: clamp(7rem, 30vw, 13rem);
    line-height: 0.8;
    color: $accent;
    -webkit-text-stroke: 2px $ink;
  }

  &__title {
    font-family: $font-display;
    font-weight: 400;
    font-size: $display-md;
    text-transform: uppercase;
  }

  &__text {
    color: $ink-soft;
  }

  &__actions {
    @include flex(row, center, center, 0.75rem);
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }
}
</style>
