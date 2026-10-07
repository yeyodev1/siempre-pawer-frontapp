<script setup lang="ts">
import type { Order } from '@/types'
import { cents, paymentLabels, paymentIcons } from '@/composables/useAdminFormat'

defineProps<{ order: Order }>()
</script>

<template>
  <article class="adm-card">
    <h2 class="adm-card__title">
      Productos
      <span class="adm-chip"><i :class="paymentIcons[order.paymentMethod]"></i> {{ paymentLabels[order.paymentMethod] }}</span>
    </h2>

    <ul class="items">
      <li v-for="item in order.items" :key="item.product + item.name" class="items__row">
        <img :src="item.image" alt="" class="adm-thumb" />
        <div class="items__text">
          <RouterLink :to="{ name: 'AdminProductEdit', params: { id: item.product } }" class="items__name">
            {{ item.name }}
          </RouterLink>
          <span class="adm-muted">{{ item.qty }} x {{ cents(item.unitPrice) }}</span>
        </div>
        <strong class="items__price">{{ cents(item.lineTotal) }}</strong>
      </li>
    </ul>

    <dl class="totals">
      <div><dt>Subtotal</dt><dd>{{ cents(order.subtotal) }}</dd></div>
      <div v-if="order.discount">
        <dt>
          Descuento
          <span v-if="order.couponCode" class="adm-chip adm-chip--gold"><i class="fa-solid fa-ticket"></i> {{ order.couponCode }}</span>
        </dt>
        <dd class="totals__discount">-{{ cents(order.discount) }}</dd>
      </div>
      <div>
        <dt>Envío</dt>
        <dd>{{ order.shippingCost ? cents(order.shippingCost) : 'Gratis' }}</dd>
      </div>
      <div class="totals__grand"><dt>Total</dt><dd>{{ cents(order.total) }}</dd></div>
    </dl>
  </article>

  <article v-if="order.paymentMethod === 'transfer'" class="adm-card">
    <h2 class="adm-card__title">Comprobante de transferencia <i class="fa-solid fa-building-columns"></i></h2>
    <a v-if="order.transferReceiptUrl" :href="order.transferReceiptUrl" target="_blank" rel="noopener" class="receipt">
      <img :src="order.transferReceiptUrl" alt="Comprobante de transferencia" />
      <span class="receipt__open"><i class="fa-solid fa-up-right-and-down-left-from-center"></i> Ver en grande</span>
    </a>
    <p v-else class="adm-muted">
      El cliente aún no sube el comprobante. Puedes pedírselo por WhatsApp.
    </p>
  </article>
</template>

<style scoped lang="scss">
.items {
  list-style: none;
  @include flex(column, stretch, flex-start, 0.75rem);
  margin-bottom: 1rem;

  &__row {
    @include flex(row, center, flex-start, 0.75rem);
  }

  &__text {
    @include flex(column, flex-start, flex-start, 0);
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-weight: 600;
    font-size: 0.92rem;

    &:hover {
      text-decoration: underline;
    }
  }

  &__price {
    font-variant-numeric: tabular-nums;
  }
}

.totals {
  border-top: 1px solid $line;
  padding-top: 0.75rem;
  @include flex(column, stretch, flex-start, 0.35rem);

  div {
    @include flex(row, center, space-between, 0.5rem);
    font-size: 0.92rem;
  }

  dt {
    color: $ink-soft;
    @include flex(row, center, flex-start, 0.4rem);
  }

  dd {
    font-variant-numeric: tabular-nums;
  }

  &__discount {
    color: $success;
  }

  &__grand {
    margin-top: 0.3rem;
    padding-top: 0.5rem;
    border-top: 1px dashed $line;

    dt,
    dd {
      color: $ink;
      font-family: $font-display;
      font-size: 1.6rem;
      letter-spacing: 0.02em;
    }
  }
}

.receipt {
  position: relative;
  display: block;
  border-radius: $radius-sm;
  overflow: hidden;
  border: 1px solid $line;
  max-width: 360px;

  img {
    width: 100%;
    max-height: 420px;
    object-fit: contain;
    background: $sand;
  }

  &__open {
    position: absolute;
    right: 0.5rem;
    bottom: 0.5rem;
    background: $ink;
    color: $surface;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.35rem 0.7rem;
    border-radius: $radius-pill;
  }
}
</style>
