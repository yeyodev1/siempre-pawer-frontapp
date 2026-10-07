<script setup lang="ts">
import { copy } from '@/config/copy'
import type { Product } from '@/types'

defineProps<{ product: Product }>()
</script>

<template>
  <div class="details">
    <section v-if="product.features?.length" class="details__block">
      <h2 class="details__title">{{ copy.product.features }}</h2>
      <ul class="details__features">
        <li v-for="f in product.features" :key="f"><i class="fa-solid fa-check"></i> {{ f }}</li>
      </ul>
    </section>

    <section v-if="product.description" class="details__block">
      <h2 class="details__title">{{ copy.product.description }}</h2>
      <p class="details__text">{{ product.description }}</p>
    </section>

    <section v-if="product.specs?.length" class="details__block">
      <h2 class="details__title">{{ copy.product.specs }}</h2>
      <dl class="details__specs">
        <div v-for="s in product.specs" :key="s.label" class="details__spec">
          <dt>{{ s.label }}</dt>
          <dd>{{ s.value }}</dd>
        </div>
      </dl>
    </section>
  </div>
</template>

<style scoped lang="scss">
.details {
  @include flex(column, stretch, flex-start, 2rem);

  &__title {
    font-family: $font-display;
    font-weight: 400;
    font-size: 1.8rem;
    text-transform: uppercase;
    margin-bottom: 0.8rem;
  }

  &__text {
    color: $ink-soft;
    white-space: pre-line;
  }

  &__features {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.5rem);

    li {
      @include flex(row, baseline, flex-start, 0.6rem);
    }

    i {
      color: $accent-deep;
      font-size: 0.85rem;
    }
  }

  &__specs {
    border-top: 2px solid $ink;
  }

  &__spec {
    @include flex(row, baseline, space-between, 1rem);
    padding: 0.65rem 0;
    border-bottom: 1px solid $line;

    dt {
      font-family: $font-condensed;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: $ink-soft;
      font-size: 0.92rem;
    }

    dd {
      font-weight: 600;
      text-align: right;
    }
  }
}
</style>
