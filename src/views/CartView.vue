<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useSettingsStore } from '@/stores/settings'
import { usePaymentMethod } from '@/composables/usePaymentMethod'
import { copy } from '@/config/copy'
import { money } from '@/utils/format'
import SectionHead from '@/components/store/SectionHead.vue'
import CartLineItem from '@/components/store/CartLineItem.vue'
import PaymentMethodPicker from '@/components/store/PaymentMethodPicker.vue'
import StateBlock from '@/components/store/StateBlock.vue'

const cart = useCartStore()
const settings = useSettingsStore()
const { isDistributor } = usePaymentMethod()

const subtotal = computed(() => cart.estimatedSubtotal(isDistributor.value))

onMounted(() => settings.load())
</script>

<template>
  <div class="cart">
    <SectionHead as="h1" :title="copy.cart.title" />

    <StateBlock v-if="cart.isEmpty" state="empty" :message="copy.cart.empty">
      <RouterLink to="/tienda" class="btn btn--primary btn--sport">{{ copy.cart.emptyCta }}</RouterLink>
    </StateBlock>

    <div v-else class="cart__layout">
      <div class="cart__lines">
        <CartLineItem v-for="line in cart.lines" :key="line.productId" :line="line" />
        <RouterLink to="/tienda" class="cart__continue">
          <i class="fa-solid fa-arrow-left"></i> {{ copy.cart.continue }}
        </RouterLink>
      </div>

      <aside class="cart__aside">
        <template v-if="!isDistributor">
          <h2 class="cart__aside-title">{{ copy.cart.methodTitle }}</h2>
          <PaymentMethodPicker compact />
          <p class="cart__hint">{{ copy.cart.methodHint }}</p>
        </template>
        <p v-else class="cart__hint">{{ copy.checkout.distributorNote }}</p>

        <div class="cart__subtotal">
          <span>{{ copy.cart.subtotal }}</span>
          <strong>{{ money(subtotal) }}</strong>
        </div>
        <p class="cart__hint">{{ copy.cart.shippingNote }}</p>
        <RouterLink to="/checkout" class="btn btn--primary btn--sport btn--lg btn--block">
          {{ copy.cart.checkout }} <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
      </aside>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart {
  @include container(1180px);
  padding-block: 2rem $space-xl;
  @include flex(column, stretch, flex-start, 1.5rem);

  &__layout {
    @include flex(column, stretch, flex-start, 2rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__lines {
    flex: 1 1 60%;
    min-width: 0;
    border-top: 2px solid $ink;
    @include flex(column, stretch, flex-start);
  }

  &__continue {
    margin-top: 1rem;
    font-family: $font-condensed;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-size: 0.92rem;
  }

  &__aside {
    flex: 1 1 35%;
    background: $sand;
    padding: 1.4rem;
    @include flex(column, stretch, flex-start, 0.9rem);

    @include from('md') {
      position: sticky;
      top: 120px;
    }
  }

  &__aside-title {
    font-family: $font-condensed;
    font-weight: 700;
    font-size: 1rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-soft;
  }

  &__subtotal {
    @include flex(row, baseline, space-between, 1rem);
    border-top: 1px solid $line;
    padding-top: 0.9rem;

    span {
      font-family: $font-condensed;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    strong {
      font-family: $font-display;
      font-weight: 400;
      font-size: 2.2rem;
      line-height: 1;
    }
  }
}
</style>
