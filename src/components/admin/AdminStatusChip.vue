<script setup lang="ts">
import type { OrderStatus } from '@/types'
import { statusLabels } from '@/composables/useAdminFormat'

defineProps<{ status: OrderStatus }>()
</script>

<template>
  <span class="status" :class="`status--${status}`">
    <span class="status__dot"></span>
    {{ statusLabels[status] || status }}
  </span>
</template>

<style scoped lang="scss">
.status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.22rem 0.7rem;
  border-radius: $radius-pill;
  font-size: 0.74rem;
  font-weight: 700;
  white-space: nowrap;

  &__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
  }

  &--pending_payment {
    background: $warning-bg;
    color: darken($warning, 14%);
  }

  &--paid {
    background: $info-bg;
    color: darken($info, 12%);
  }

  &--preparing {
    background: $accent-soft;
    color: darken($accent-deep, 10%);
  }

  &--shipped {
    background: rgba(#7b5cc4, 0.12);
    color: #5a3fa0;
  }

  &--delivered {
    background: $success-bg;
    color: darken($success, 14%);
  }

  &--cancelled {
    background: $danger-bg;
    color: $danger;
  }
}
</style>
