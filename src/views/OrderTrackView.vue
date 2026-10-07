<script setup lang="ts">
import { ref } from 'vue'
import { useOrderTrack } from '@/composables/useOrderTrack'
import { copy } from '@/config/copy'
import { site, whatsappLink } from '@/config/site'
import { formatDate } from '@/utils/format'
import StateBlock from '@/components/store/StateBlock.vue'
import OrderTimeline from '@/components/store/OrderTimeline.vue'
import OrderLines from '@/components/store/OrderLines.vue'
import BankAccounts from '@/components/store/BankAccounts.vue'
import ReceiptUpload from '@/components/store/ReceiptUpload.vue'

const { order, loading, error, email, number, isNew, awaitingTransfer, uploading, settings, load, submitEmail, uploadReceipt } =
  useOrderTrack()
const emailInput = ref('')
const t = copy.order
</script>

<template>
  <div class="order">
    <header class="order__head">
      <span class="order__eyebrow">{{ t.eyebrow }}</span>
      <h1 class="order__number">{{ number }}</h1>
      <p v-if="order" class="order__meta">
        {{ formatDate(order.createdAt) }} · {{ t.payMethod }}: {{ site.paymentLabels[order.paymentMethod] }}
      </p>
    </header>

    <form v-if="!email" class="order__ask" @submit.prevent="submitEmail(emailInput)">
      <label for="track-email">{{ t.emailPrompt }}</label>
      <div class="order__ask-row">
        <input id="track-email" v-model="emailInput" type="email" required autocomplete="email" />
        <button class="btn btn--dark btn--sport" type="submit">{{ copy.track.submit }}</button>
      </div>
    </form>

    <StateBlock v-else-if="loading && !order" state="loading" />
    <StateBlock v-else-if="error" state="error" :message="error" @retry="load">
      <RouterLink to="/rastrear" class="order__link">{{ copy.track.title }}</RouterLink>
    </StateBlock>

    <template v-else-if="order">
      <p v-if="isNew" class="order__notice" :class="`order__notice--${order.paymentMethod}`">
        <i class="fa-solid fa-circle-check"></i> {{ t.created[order.paymentMethod] }}
      </p>
      <p v-if="order.status === 'cancelled'" class="order__notice order__notice--cancelled">{{ t.cancelled }}</p>

      <section class="order__block">
        <h2 class="order__title">{{ t.timeline }}</h2>
        <OrderTimeline :order="order" />
        <div v-if="order.trackingNumber" class="order__tracking">
          <span>{{ t.tracking }}: <strong>{{ order.trackingNumber }}</strong></span>
          <a v-if="order.trackingUrl" :href="order.trackingUrl" target="_blank" rel="noopener" class="btn btn--dark btn--sport">
            {{ t.trackingCta }} <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
      </section>

      <div class="order__cols">
        <section v-if="awaitingTransfer" class="order__block order__block--pay">
          <h2 class="order__title">{{ t.bankTitle }}</h2>
          <BankAccounts :accounts="settings.settings.bankAccounts" :order-number="order.number" />
          <h3 class="order__subtitle">{{ t.receiptTitle }}</h3>
          <ReceiptUpload :uploading="uploading" :current-url="order.transferReceiptUrl" @upload="uploadReceipt" />
        </section>

        <section class="order__block">
          <h2 class="order__title">{{ t.items }}</h2>
          <OrderLines :order="order" />
        </section>

        <section class="order__block">
          <h2 class="order__title">{{ t.delivery }}</h2>
          <p v-if="order.shipping.method === 'pickup'">
            {{ t.pickupAt }} {{ settings.settings.pickupAddress || site.city }}
          </p>
          <p v-else class="order__address">
            {{ order.shipping.receiverName }}<br />
            {{ order.shipping.address }}<br />
            {{ order.shipping.city }}, {{ order.shipping.province }}
            <template v-if="order.shipping.reference"><br />{{ order.shipping.reference }}</template>
          </p>
          <a :href="whatsappLink(`Hola, tengo una pregunta sobre mi pedido ${order.number}`)" target="_blank" rel="noopener" class="order__link">
            <i class="fa-brands fa-whatsapp"></i> {{ t.help }}
          </a>
        </section>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.order {
  @include container(1080px);
  padding-block: 2rem $space-xl;
  @include flex(column, stretch, flex-start, 1.5rem);

  &__eyebrow {
    font-family: $font-condensed;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-size: 0.8rem;
    background: $accent;
    color: $on-accent;
    padding: 0.2rem 0.75rem;
    display: inline-block;
    transform: skewX(-12deg);
  }

  &__number {
    font-family: $font-display;
    font-weight: 400;
    font-size: $display-lg;
    line-height: 0.95;
    margin-top: 0.4rem;
  }

  &__meta {
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__ask {
    max-width: 480px;
  }

  &__ask-row {
    @include flex(row, stretch, flex-start, 0.5rem);

    .btn {
      flex-shrink: 0;
    }
  }

  &__notice {
    padding: 1rem 1.2rem;
    border-left: 4px solid $success;
    background: $success-bg;
    font-weight: 500;

    i {
      color: $success;
      margin-right: 0.3rem;
    }

    &--transfer {
      border-color: $accent;
      background: $accent-soft;

      i {
        color: $accent-deep;
      }
    }

    &--cancelled {
      border-color: $danger;
      background: $danger-bg;
    }
  }

  &__block {
    @include flex(column, stretch, flex-start, 1rem);
    border-top: 2px solid $ink;
    padding-top: 1.2rem;

    &--pay {
      background: $sand;
      padding: 1.2rem;
    }
  }

  &__cols {
    @include flex-cards(300px, 2rem);
  }

  &__title {
    font-family: $font-display;
    font-weight: 400;
    font-size: 1.8rem;
    text-transform: uppercase;
    line-height: 1;
  }

  &__subtitle {
    font-family: $font-condensed;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-top: 0.5rem;
  }

  &__tracking {
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
    background: $sand;
    padding: 0.9rem 1rem;
  }

  &__address {
    color: $ink-soft;
  }

  &__link {
    font-weight: 600;
    text-decoration: underline;
  }
}
</style>
