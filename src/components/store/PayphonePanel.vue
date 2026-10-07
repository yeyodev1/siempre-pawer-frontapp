<script setup lang="ts">
import { copy } from '@/config/copy'
import { money } from '@/utils/format'
import { PAYPHONE_CONTAINER } from '@/composables/usePayphone'
import type { Order } from '@/types'

defineProps<{ order: Order | null; status: 'idle' | 'loading' | 'ready' | 'error' }>()
const emit = defineEmits<{ retry: []; back: [] }>()
const t = copy.checkout
</script>

<template>
  <section class="pay">
    <header class="pay__head">
      <span class="pay__badge"><i class="fa-solid fa-lock"></i> Payphone</span>
      <h1 class="pay__title">{{ t.payTitle }}</h1>
      <p class="pay__text">{{ t.payText }}</p>
      <div v-if="order" class="pay__order">
        <span>{{ copy.order.eyebrow }} {{ order.number }}</span>
        <strong>{{ money(order.total) }}</strong>
      </div>
    </header>

    <div class="pay__box">
      <p v-if="status === 'loading'" class="pay__state">
        <i class="fa-solid fa-spinner fa-spin"></i> {{ t.payLoading }}
      </p>
      <div v-if="status === 'error'" class="pay__state pay__state--error">
        <p>{{ t.payError }}</p>
        <button type="button" class="btn btn--dark btn--sport" @click="emit('retry')">{{ t.payRetry }}</button>
      </div>
      <div :id="PAYPHONE_CONTAINER"></div>
    </div>

    <button type="button" class="pay__back" @click="emit('back')">
      <i class="fa-solid fa-arrow-left"></i> {{ t.payBack }}
    </button>
  </section>
</template>

<style scoped lang="scss">
.pay {
  max-width: 560px;
  margin-inline: auto;
  @include flex(column, stretch, flex-start, 1.25rem);

  &__head {
    @include flex(column, flex-start, flex-start, 0.6rem);
  }

  &__badge {
    font-family: $font-condensed;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-size: 0.8rem;
    background: $ink;
    color: $accent;
    padding: 0.2rem 0.7rem;
    transform: skewX(-12deg);
  }

  &__title {
    font-family: $font-display;
    font-weight: 400;
    font-size: $display-md;
    text-transform: uppercase;
    line-height: 0.95;
  }

  &__text {
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__order {
    width: 100%;
    @include flex(row, baseline, space-between, 1rem);
    border-block: 2px solid $ink;
    padding-block: 0.7rem;

    span {
      font-family: $font-condensed;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    strong {
      font-family: $font-display;
      font-weight: 400;
      font-size: 2.2rem;
      line-height: 1;
    }
  }

  &__box {
    background: $paper;
    border: 1px solid $line;
    padding: 1rem;
    min-height: 200px;
  }

  &__state {
    @include flex(column, center, center, 0.8rem);
    text-align: center;
    padding: 2rem 0;
    color: $ink-soft;

    &--error {
      color: $danger;
    }
  }

  &__back {
    align-self: center;
    font-family: $font-condensed;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-size: 0.9rem;
    color: $ink-soft;

    &:hover {
      color: $ink;
    }
  }
}
</style>
