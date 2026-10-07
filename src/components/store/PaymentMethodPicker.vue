<script setup lang="ts">
import { site } from '@/config/site'
import { usePaymentMethod } from '@/composables/usePaymentMethod'
import type { PaymentMethod } from '@/types'

defineProps<{ compact?: boolean }>()

const { methods, method, select } = usePaymentMethod()

const icons: Record<PaymentMethod, string> = {
  card: 'fa-solid fa-credit-card',
  transfer: 'fa-solid fa-building-columns',
  cod: 'fa-solid fa-hand-holding-dollar',
}
</script>

<template>
  <div class="methods" role="radiogroup" :class="{ 'methods--compact': compact }">
    <label
      v-for="m in methods"
      :key="m"
      class="method"
      :class="{ 'method--active': m === method }"
    >
      <input type="radio" name="payment-method" :value="m" :checked="m === method" class="visually-hidden" @change="select(m)" />
      <i :class="icons[m]" class="method__icon"></i>
      <span class="method__text">
        <strong>{{ site.paymentLabels[m] }}</strong>
        <small v-if="!compact">{{ site.paymentHints[m] }}</small>
      </span>
      <span class="method__dot"></span>
    </label>
  </div>
</template>

<style scoped lang="scss">
.methods {
  @include flex(column, stretch, flex-start, 0.6rem);
}

.method {
  @include flex(row, center, flex-start, 0.85rem);
  margin: 0;
  padding: 0.9rem 1rem;
  border: 1.5px solid $line;
  border-radius: 6px;
  cursor: pointer;
  color: $ink;
  @include transition(border-color);

  &:hover {
    border-color: $ink-muted;
  }

  &:focus-within {
    outline: 2px solid $accent;
    outline-offset: 2px;
  }

  &__icon {
    font-size: 1.15rem;
    width: 1.5rem;
    text-align: center;
  }

  &__text {
    @include flex(column, flex-start, flex-start);
    flex: 1;

    strong {
      font-size: 0.95rem;
      font-weight: 600;
    }

    small {
      font-size: $text-xs;
      color: $ink-soft;
      font-weight: 400;
    }
  }

  &__dot {
    width: 1.15rem;
    height: 1.15rem;
    border-radius: 50%;
    border: 1.5px solid $ink-muted;
    flex-shrink: 0;
  }

  &--active {
    border-color: $ink;
    background: $sand;

    .method__dot {
      border: 5px solid $ink;
      background: $accent;
    }
  }
}

.methods--compact .method {
  padding: 0.65rem 0.9rem;
}
</style>
