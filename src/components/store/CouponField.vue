<script setup lang="ts">
import { copy } from '@/config/copy'
import { useCheckoutForm } from '@/composables/useCheckoutForm'

defineProps<{ loading: boolean; error: string }>()
const emit = defineEmits<{ apply: []; remove: [] }>()

const { couponInput, coupon } = useCheckoutForm()
const t = copy.checkout
</script>

<template>
  <div class="coupon">
    <p v-if="coupon" class="coupon__applied">
      <i class="fa-solid fa-tag"></i>
      <span>{{ t.couponApplied(coupon.code, coupon.discountPct) }}</span>
      <button type="button" :aria-label="t.couponRemove" @click="emit('remove')"><i class="fa-solid fa-xmark"></i></button>
    </p>
    <div v-else class="coupon__row">
      <label for="co-coupon" class="visually-hidden">{{ t.coupon }}</label>
      <input
        id="co-coupon"
        v-model="couponInput"
        :placeholder="t.couponPlaceholder"
        autocapitalize="characters"
        @keydown.enter.prevent="emit('apply')"
      />
      <button type="button" class="btn btn--dark btn--sport" :disabled="loading || !couponInput.trim()" @click="emit('apply')">
        <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
        {{ t.couponApply }}
      </button>
    </div>
    <p v-if="error && !coupon" class="coupon__error">{{ error }}</p>
  </div>
</template>

<style scoped lang="scss">
.coupon {
  @include flex(column, stretch, flex-start, 0.4rem);

  &__row {
    @include flex(row, stretch, flex-start, 0.5rem);

    input {
      text-transform: uppercase;
      min-width: 0;
    }

    .btn {
      padding-inline: 1rem;
      flex-shrink: 0;
    }
  }

  &__applied {
    @include flex(row, center, flex-start, 0.6rem);
    background: $accent-soft;
    border: 1px dashed $accent-deep;
    padding: 0.6rem 0.8rem;
    font-size: $text-sm;
    font-weight: 600;

    span {
      flex: 1;
    }
  }

  &__error {
    font-size: $text-xs;
    color: $danger;
  }
}
</style>
