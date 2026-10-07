<script setup lang="ts">
import { copy } from '@/config/copy'
import { money } from '@/utils/format'
import type { Order } from '@/types'

defineProps<{ order: Order }>()
const t = copy.checkout
</script>

<template>
  <div class="lines">
    <ul class="lines__list">
      <li v-for="item in order.items" :key="item.product + item.name" class="lines__item">
        <span class="lines__thumb"><img v-if="item.image" :src="item.image" :alt="''" /></span>
        <span class="lines__name">
          <RouterLink v-if="item.slug" :to="`/producto/${item.slug}`">{{ item.name }}</RouterLink>
          <template v-else>{{ item.name }}</template>
          <small>{{ item.qty }} x {{ money(item.unitPrice) }}</small>
        </span>
        <strong>{{ money(item.lineTotal) }}</strong>
      </li>
    </ul>
    <dl class="lines__totals">
      <div><dt>{{ t.subtotal }}</dt><dd>{{ money(order.subtotal) }}</dd></div>
      <div v-if="order.discount">
        <dt>{{ t.discount }} <small v-if="order.couponCode">({{ order.couponCode }})</small></dt>
        <dd>-{{ money(order.discount) }}</dd>
      </div>
      <div><dt>{{ t.shipping }}</dt><dd>{{ order.shippingCost ? money(order.shippingCost) : t.free }}</dd></div>
      <div class="lines__total"><dt>{{ t.total }}</dt><dd>{{ money(order.total) }}</dd></div>
    </dl>
  </div>
</template>

<style scoped lang="scss">
.lines {
  @include flex(column, stretch, flex-start, 1rem);

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.8rem);
  }

  &__item {
    @include flex(row, center, flex-start, 0.8rem);
  }

  &__thumb {
    flex: 0 0 3.5rem;
    height: 3.5rem;
    background: $sand;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 8%;
      mix-blend-mode: multiply;
    }
  }

  &__name {
    flex: 1;
    min-width: 0;
    @include flex(column, flex-start, flex-start);
    font-weight: 500;
    font-size: $text-sm;

    small {
      color: $ink-soft;
      font-weight: 400;
    }
  }

  &__totals {
    border-top: 1px solid $line;
    padding-top: 0.8rem;
    @include flex(column, stretch, flex-start, 0.35rem);

    div {
      @include flex(row, baseline, space-between, 1rem);
      font-size: $text-sm;
    }
  }

  &__total {
    border-top: 2px solid $ink;
    padding-top: 0.5rem;

    dt {
      font-family: $font-condensed;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    dd {
      font-family: $font-display;
      font-size: 2rem;
      line-height: 1;
    }
  }
}
</style>
