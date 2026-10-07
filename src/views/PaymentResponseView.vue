<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { orderService } from '@/services/order.service'
import { useCartStore } from '@/stores/cart'
import { useAnalytics } from '@/composables/useAnalytics'
import { copy } from '@/config/copy'
import { money } from '@/utils/format'
import { removeKey } from '@/utils/storage'
import type { ApiError, Order } from '@/types'

const route = useRoute()
const cart = useCartStore()
const analytics = useAnalytics()

const state = ref<'loading' | 'approved' | 'rejected' | 'missing'>('loading')
const order = ref<Order | null>(null)
const message = ref('')
const t = copy.payment

// Payphone reversa el cobro si no se confirma en 5 minutos: se confirma al cargar.
onMounted(async () => {
  const id = route.query.id
  const clientTransactionId = route.query.clientTransactionId
  if (typeof id !== 'string' || typeof clientTransactionId !== 'string' || !id || !clientTransactionId) {
    state.value = 'missing'
    return
  }
  try {
    order.value = await orderService.confirm(id, clientTransactionId)
    const ok = ['paid', 'preparing', 'shipped', 'delivered'].includes(order.value.status)
    state.value = ok ? 'approved' : 'rejected'
    if (ok) {
      cart.clear()
      removeKey('pawer_ref')
      analytics.purchase(order.value)
    }
  } catch (e) {
    message.value = (e as ApiError).message
    state.value = 'rejected'
  }
})
</script>

<template>
  <section class="resp">
    <div class="resp__card" :class="`resp__card--${state}`">
      <template v-if="state === 'loading'">
        <i class="fa-solid fa-spinner fa-spin resp__icon"></i>
        <h1 class="resp__title">{{ t.confirming }}</h1>
        <p class="resp__text">{{ t.confirmingText }}</p>
      </template>

      <template v-else-if="state === 'approved'">
        <i class="fa-solid fa-circle-check resp__icon"></i>
        <h1 class="resp__title">{{ t.approved }}</h1>
        <p class="resp__text">{{ t.approvedText }}</p>
        <div v-if="order" class="resp__order">
          <span>{{ order.number }}</span>
          <strong>{{ money(order.total) }}</strong>
        </div>
        <RouterLink
          v-if="order"
          :to="{ name: 'OrderTrack', params: { number: order.number }, query: { email: order.customer.email } }"
          class="btn btn--primary btn--sport btn--lg"
        >
          {{ t.viewOrder }} <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
      </template>

      <template v-else>
        <i class="fa-solid fa-circle-xmark resp__icon"></i>
        <h1 class="resp__title">{{ t.rejected }}</h1>
        <p class="resp__text">{{ state === 'missing' ? t.missing : message || t.rejectedText }}</p>
        <RouterLink to="/checkout" class="btn btn--dark btn--sport btn--lg">{{ t.retry }}</RouterLink>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
.resp {
  @include container(560px);
  flex: 1;
  @include flex(column, stretch, center);
  padding-block: $space-xl;

  &__card {
    @include flex(column, center, flex-start, 1rem);
    text-align: center;
    border-top: 6px solid $ink;
    padding: 2.5rem 1.5rem;
    background: $sand;

    &--approved {
      border-color: $accent;
    }

    &--rejected,
    &--missing {
      border-color: $danger;
    }
  }

  &__icon {
    font-size: 3rem;
  }

  &__card--approved &__icon {
    color: $success;
  }

  &__card--rejected &__icon,
  &__card--missing &__icon {
    color: $danger;
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
    max-width: 40ch;
  }

  &__order {
    width: 100%;
    @include flex(row, baseline, space-between, 1rem);
    border-block: 1px solid $line;
    padding-block: 0.7rem;
    font-family: $font-condensed;
    font-weight: 700;
    letter-spacing: 0.06em;

    strong {
      font-family: $font-display;
      font-weight: 400;
      font-size: 2rem;
    }
  }
}
</style>
