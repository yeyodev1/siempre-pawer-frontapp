<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { useCheckout } from '@/composables/useCheckout'
import { usePaymentMethod } from '@/composables/usePaymentMethod'
import { copy } from '@/config/copy'
import SectionHead from '@/components/store/SectionHead.vue'
import StateBlock from '@/components/store/StateBlock.vue'
import CheckoutSection from '@/components/store/CheckoutSection.vue'
import CheckoutCustomer from '@/components/store/CheckoutCustomer.vue'
import CheckoutDelivery from '@/components/store/CheckoutDelivery.vue'
import CheckoutInvoice from '@/components/store/CheckoutInvoice.vue'
import CheckoutSummary from '@/components/store/CheckoutSummary.vue'
import PaymentMethodPicker from '@/components/store/PaymentMethodPicker.vue'
import PayphonePanel from '@/components/store/PayphonePanel.vue'

const cart = useCartStore()
const { isDistributor } = usePaymentMethod()
const {
  quote, quoteLoading, quoteError, couponLoading, couponError, submitting,
  payphoneConfig, pendingOrder, payphoneStatus,
  applyCoupon, removeCoupon, submit, retryPayphone, cancelPayphone, fetchQuote,
} = useCheckout()
const t = copy.checkout
</script>

<template>
  <div class="checkout">
    <PayphonePanel
      v-if="payphoneConfig"
      :order="pendingOrder"
      :status="payphoneStatus"
      @retry="retryPayphone"
      @back="cancelPayphone"
    />

    <StateBlock v-else-if="cart.isEmpty" state="empty" :message="t.emptyCart">
      <RouterLink to="/tienda" class="btn btn--primary btn--sport">{{ copy.cart.emptyCta }}</RouterLink>
    </StateBlock>

    <template v-else>
      <SectionHead as="h1" :title="t.title" />
      <form class="checkout__layout" novalidate @submit.prevent="($event.target as HTMLFormElement).reportValidity() && submit()">
        <div class="checkout__form">
          <CheckoutCustomer />
          <CheckoutDelivery />
          <CheckoutSection :title="t.payment" icon="fa-solid fa-wallet">
            <p v-if="isDistributor" class="hint">{{ t.distributorNote }}</p>
            <PaymentMethodPicker class="field" />
          </CheckoutSection>
          <CheckoutInvoice />
        </div>

        <CheckoutSummary
          class="checkout__summary"
          :quote="quote"
          :loading="quoteLoading"
          :error="quoteError"
          :coupon-loading="couponLoading"
          :coupon-error="couponError"
          :submitting="submitting"
          @apply-coupon="applyCoupon"
          @remove-coupon="removeCoupon"
          @retry="fetchQuote"
        />
      </form>
    </template>
  </div>
</template>

<style scoped lang="scss">
.checkout {
  @include container(1180px);
  padding-block: 2rem $space-xl;
  @include flex(column, stretch, flex-start, 1.5rem);

  &__layout {
    @include flex(column, stretch, flex-start, 1.5rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
      gap: 2.5rem;
    }
  }

  &__form {
    flex: 1 1 60%;
    min-width: 0;
  }

  &__summary {
    flex: 1 1 38%;
    min-width: 0;

    @include from('md') {
      position: sticky;
      top: 120px;
    }
  }
}
</style>
