<script setup lang="ts">
import { computed } from 'vue'
import { copy } from '@/config/copy'
import { money } from '@/utils/format'
import { useCartStore } from '@/stores/cart'
import { usePaymentMethod } from '@/composables/usePaymentMethod'
import { unitPrice } from '@/utils/pricing'
import QtyStepper from './QtyStepper.vue'
import type { CartLine } from '@/types'

const props = defineProps<{ line: CartLine }>()

const cart = useCartStore()
const { method, isDistributor } = usePaymentMethod()

const unit = computed(() => unitPrice(props.line, method.value, props.line.qty, isDistributor.value))
const qty = computed({
  get: () => props.line.qty,
  set: (value: number) => cart.setQty(props.line.productId, value),
})
</script>

<template>
  <article class="line">
    <RouterLink :to="`/producto/${line.slug}`" class="line__media">
      <img v-if="line.image" :src="line.image" :alt="line.name" loading="lazy" />
      <i v-else class="fa-solid fa-futbol"></i>
    </RouterLink>
    <div class="line__body">
      <div class="line__top">
        <RouterLink :to="`/producto/${line.slug}`" class="line__name">{{ line.name }}</RouterLink>
        <button class="line__remove" type="button" :aria-label="`${copy.cart.remove} ${line.name}`" @click="cart.remove(line.productId)">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
      <p class="line__unit">{{ money(unit) }} {{ copy.cart.each }}</p>
      <div class="line__bottom">
        <QtyStepper v-model="qty" :max="line.stock" small />
        <strong class="line__total">{{ money(unit * line.qty) }}</strong>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.line {
  @include flex(row, stretch, flex-start, 0.9rem);
  padding-block: 1rem;
  border-bottom: 1px solid $line;

  &__media {
    flex: 0 0 5.5rem;
    aspect-ratio: 1;
    background: $sand;
    @include flex(row, center, center);
    color: $line;
    font-size: 2rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 8%;
      mix-blend-mode: multiply;
    }
  }

  &__body {
    flex: 1;
    min-width: 0;
    @include flex(column, stretch, space-between, 0.3rem);
  }

  &__top {
    @include flex(row, flex-start, space-between, 0.5rem);
  }

  &__name {
    font-weight: 600;
    line-height: 1.3;
  }

  &__remove {
    color: $ink-muted;
    padding: 0.2rem;

    &:hover {
      color: $danger;
    }
  }

  &__unit {
    font-size: $text-xs;
    color: $ink-soft;
  }

  &__bottom {
    @include flex(row, center, space-between, 0.5rem);
  }

  &__total {
    font-family: $font-display;
    font-weight: 400;
    font-size: 1.5rem;
  }
}
</style>
