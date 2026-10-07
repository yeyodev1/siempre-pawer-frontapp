<script setup lang="ts">
import { computed } from 'vue'
import { copy } from '@/config/copy'
import { money } from '@/utils/format'
import { useCartStore } from '@/stores/cart'
import { usePaymentMethod } from '@/composables/usePaymentMethod'
import CouponField from './CouponField.vue'
import type { Quote } from '@/types'

const props = defineProps<{
  quote: Quote | null
  loading: boolean
  error: string
  couponLoading: boolean
  couponError: string
  submitting: boolean
}>()
const emit = defineEmits<{ applyCoupon: []; removeCoupon: []; retry: [] }>()

const cart = useCartStore()
const { method, isDistributor } = usePaymentMethod()
const t = copy.checkout

// Mientras llega la cotización se muestran las líneas del carrito.
const lines = computed(() =>
  props.quote?.items.length
    ? props.quote.items.map((i) => ({ id: i.productId, name: i.name, image: i.image, qty: i.qty, total: i.lineTotal }))
    : cart.lines.map((l) => ({ id: l.productId, name: l.name, image: l.image, qty: l.qty, total: cart.lineUnit(l, isDistributor.value) * l.qty })),
)
</script>

<template>
  <aside class="summary">
    <h2 class="summary__title">{{ t.summary }}</h2>
    <ul class="summary__lines">
      <li v-for="l in lines" :key="l.id" class="summary__line">
        <span class="summary__thumb">
          <img v-if="l.image" :src="l.image" :alt="''" />
          <b>{{ l.qty }}</b>
        </span>
        <span class="summary__name">{{ l.name }}</span>
        <span>{{ money(l.total) }}</span>
      </li>
    </ul>

    <CouponField
      v-if="!isDistributor"
      :loading="couponLoading"
      :error="couponError"
      @apply="emit('applyCoupon')"
      @remove="emit('removeCoupon')"
    />

    <p v-if="error" class="summary__error">
      {{ error }} <button type="button" @click="emit('retry')">{{ copy.states.retry }}</button>
    </p>

    <dl class="summary__totals" :class="{ 'summary__totals--loading': loading }">
      <div><dt>{{ t.subtotal }}</dt><dd>{{ quote ? money(quote.subtotal) : '...' }}</dd></div>
      <div v-if="quote?.discount" class="summary__discount">
        <dt>{{ t.discount }} <small v-if="quote.couponCode">({{ quote.couponCode }})</small></dt>
        <dd>-{{ money(quote.discount) }}</dd>
      </div>
      <div><dt>{{ t.shipping }}</dt><dd>{{ quote ? (quote.shippingCost ? money(quote.shippingCost) : t.free) : '...' }}</dd></div>
      <div class="summary__total"><dt>{{ t.total }}</dt><dd>{{ quote ? money(quote.total) : '...' }}</dd></div>
    </dl>

    <button
      type="submit"
      class="btn btn--primary btn--sport btn--lg btn--block"
      :disabled="submitting || !quote || loading"
    >
      <i v-if="submitting" class="fa-solid fa-spinner fa-spin"></i>
      <i v-else-if="method === 'card'" class="fa-solid fa-lock"></i>
      {{ submitting ? t.submitting : t.submit[method] }}
    </button>
    <p class="summary__terms">
      {{ t.terms }}
      <RouterLink to="/politicas/terminos">Términos</RouterLink> ·
      <RouterLink to="/politicas/envios">Envíos</RouterLink>
    </p>
  </aside>
</template>

<style scoped lang="scss">
.summary {
  background: $sand;
  padding: 1.4rem;
  @include flex(column, stretch, flex-start, 1rem);

  &__title {
    font-family: $font-display;
    font-weight: 400;
    font-size: 1.9rem;
    text-transform: uppercase;
    line-height: 1;
  }

  &__lines {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.7rem);
  }

  &__line {
    @include flex(row, center, flex-start, 0.75rem);
    font-size: $text-sm;
  }

  &__thumb {
    position: relative;
    flex: 0 0 3.2rem;
    height: 3.2rem;
    background: $paper;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 8%;
    }

    b {
      position: absolute;
      top: -0.4rem;
      right: -0.4rem;
      min-width: 1.3rem;
      height: 1.3rem;
      border-radius: $radius-pill;
      background: $ink;
      color: $paper;
      font-size: 0.72rem;
      @include flex(row, center, center);
    }
  }

  &__name {
    flex: 1;
    min-width: 0;
    font-weight: 500;
  }

  &__error {
    font-size: $text-xs;
    color: $danger;

    button {
      text-decoration: underline;
      font-weight: 600;
    }
  }

  &__totals {
    border-top: 1px solid $line;
    padding-top: 0.8rem;
    @include flex(column, stretch, flex-start, 0.4rem);
    @include transition(opacity);

    div {
      @include flex(row, baseline, space-between, 1rem);
      font-size: $text-sm;
    }

    dd {
      font-weight: 600;
    }

    &--loading {
      opacity: 0.5;
    }
  }

  &__discount dd {
    color: $success;
  }

  &__total {
    border-top: 2px solid $ink;
    padding-top: 0.6rem;
    margin-top: 0.3rem;

    dt {
      font-family: $font-condensed;
      font-weight: 700;
      font-size: 1.1rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    dd {
      font-family: $font-display;
      font-weight: 400;
      font-size: 2.4rem;
      line-height: 1;
    }
  }

  &__terms {
    font-size: $text-xs;
    color: $ink-soft;
    text-align: center;

    a {
      text-decoration: underline;
    }
  }
}
</style>
