<script setup lang="ts">
import { computed } from 'vue'
import { site } from '@/config/site'
import { formatDateTime } from '@/utils/format'
import type { Order, OrderStatus } from '@/types'

const props = defineProps<{ order: Order }>()

// Contra entrega no pasa por "pendiente de pago" ni "pagado" antes de despachar.
const steps = computed<OrderStatus[]>(() =>
  props.order.paymentMethod === 'cod'
    ? ['preparing', 'shipped', 'delivered']
    : ['pending_payment', 'paid', 'preparing', 'shipped', 'delivered'],
)
const currentIndex = computed(() => steps.value.indexOf(props.order.status))

function dateFor(status: OrderStatus): string {
  const entry = [...(props.order.history || [])].reverse().find((h) => h.status === status)
  return entry ? formatDateTime(entry.at) : ''
}
</script>

<template>
  <ol v-if="order.status !== 'cancelled'" class="timeline">
    <li
      v-for="(step, i) in steps"
      :key="step"
      class="timeline__step"
      :class="{ 'timeline__step--done': i <= currentIndex, 'timeline__step--current': i === currentIndex }"
    >
      <span class="timeline__dot"><i v-if="i <= currentIndex" class="fa-solid fa-check"></i></span>
      <span class="timeline__label">
        <strong>{{ site.statusLabels[step] }}</strong>
        <small v-if="i <= currentIndex && dateFor(step)">{{ dateFor(step) }}</small>
      </span>
    </li>
  </ol>
  <p v-else class="timeline__cancelled"><i class="fa-solid fa-ban"></i> {{ site.statusLabels.cancelled }}</p>
</template>

<style scoped lang="scss">
.timeline {
  list-style: none;
  @include flex(column, stretch, flex-start);

  @include from('md') {
    flex-direction: row;
  }

  &__step {
    position: relative;
    flex: 1;
    @include flex(row, flex-start, flex-start, 0.8rem);
    padding-bottom: 1.2rem;
    color: $ink-muted;

    @include from('md') {
      flex-direction: column;
      padding: 0 0.5rem 0 0;
    }

    // La línea que une los pasos.
    &:not(:last-child)::after {
      content: '';
      position: absolute;
      background: $line;
      left: 0.85rem;
      top: 1.9rem;
      bottom: 0.1rem;
      width: 2px;

      @include from('md') {
        left: 2.2rem;
        right: 0.4rem;
        top: 0.85rem;
        bottom: auto;
        width: auto;
        height: 2px;
      }
    }

    &--done {
      color: $ink;

      &::after {
        background: $ink !important;
      }
    }
  }

  &__dot {
    flex-shrink: 0;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    border: 2px solid $line;
    background: $paper;
    @include flex(row, center, center);
    font-size: 0.7rem;
  }

  &__step--done &__dot {
    background: $ink;
    border-color: $ink;
    color: $paper;
  }

  &__step--current &__dot {
    background: $accent;
    border-color: $ink;
    color: $on-accent;
  }

  &__label {
    @include flex(column, flex-start, flex-start);

    strong {
      font-family: $font-condensed;
      font-weight: 700;
      font-size: 0.95rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    small {
      font-size: $text-xs;
      color: $ink-soft;
    }
  }

  &__cancelled {
    color: $danger;
    font-weight: 600;
  }
}
</style>
