<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Order } from '@/types'
import AdminStatusChip from './AdminStatusChip.vue'
import { cents, when, paymentLabels, paymentIcons } from '@/composables/useAdminFormat'

defineProps<{ orders: Order[] }>()
const router = useRouter()

function open(order: Order) {
  router.push({ name: 'AdminOrderDetail', params: { id: order._id } })
}
</script>

<template>
  <div class="adm-table">
    <div class="adm-table__head">
      <span class="col-num">Pedido</span>
      <span class="adm-table__cell--main">Cliente</span>
      <span class="col-pay">Pago</span>
      <span class="col-status">Estado</span>
      <span class="col-total">Total</span>
    </div>
    <div
      v-for="order in orders"
      :key="order._id"
      class="adm-table__row adm-table__row--link"
      role="link"
      tabindex="0"
      @click="open(order)"
      @keydown.enter="open(order)"
    >
      <div class="adm-table__cell col-num">
        <strong>{{ order.number }}</strong>
        <small class="adm-muted">{{ when(order.createdAt) }}</small>
      </div>
      <div class="adm-table__cell adm-table__cell--main">
        {{ order.customer.firstName }} {{ order.customer.lastName }}
        <span v-if="order.isDistributor" class="adm-chip adm-chip--gold">Distribuidor</span>
        <small class="adm-muted">{{ order.shipping.method === 'pickup' ? 'Retiro en Urdesa' : order.shipping.city }}</small>
      </div>
      <div class="adm-table__cell col-pay">
        <i :class="paymentIcons[order.paymentMethod]"></i>
        {{ paymentLabels[order.paymentMethod] }}
      </div>
      <div class="adm-table__cell col-status">
        <AdminStatusChip :status="order.status" />
      </div>
      <div class="adm-table__cell col-total">{{ cents(order.total) }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.adm-table__cell {
  small {
    display: block;
    font-weight: 400;
  }

  .adm-chip {
    margin-left: 0.3rem;
    vertical-align: middle;
  }
}

// En móvil: número y total arriba, cliente al medio, pago y estado abajo.
.col-num {
  order: -2;
  flex: 1 1 auto;
}

.col-total {
  order: -1;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.col-pay {
  flex: 1 1 auto;
  color: $ink-soft;
  font-size: $text-sm;

  i {
    color: $ink-muted;
    margin-right: 0.25rem;
  }
}

@include from('lg') {
  .col-num,
  .col-total {
    order: 0;
  }

  .col-num {
    flex: 0 0 125px;
  }

  .col-pay {
    flex: 0 0 135px;
  }

  .col-status {
    flex: 0 0 130px;
  }

  .col-total {
    flex: 0 0 90px;
    text-align: right;
  }

  // La cabecera hereda el estilo de la tabla, no el de la celda de pago.
  .adm-table__head .col-pay {
    font-size: inherit;
    color: inherit;
  }
}
</style>
