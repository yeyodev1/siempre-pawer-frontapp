<script setup lang="ts">
import { computed } from 'vue'
import type { Order } from '@/types'
import { shippingLabels, waNumber } from '@/composables/useAdminFormat'
import { useAdminCopy } from '@/composables/useAdminCopy'
import AdminInfoRows from './AdminInfoRows.vue'
import type { InfoRow } from './adminTypes'

const props = defineProps<{ order: Order }>()
const { copy } = useAdminCopy()

const customer = computed<InfoRow[]>(() => {
  const c = props.order.customer
  return [
    { label: 'Nombre', value: `${c.firstName} ${c.lastName}`, copy: true },
    { label: 'Correo', value: c.email, copy: true, href: `mailto:${c.email}` },
    { label: 'Teléfono', value: c.phone, copy: true, href: `https://wa.me/${waNumber(c.phone)}` },
    { label: 'Cédula / RUC', value: c.documentId, copy: true },
  ]
})

const shipping = computed<InfoRow[]>(() => {
  const s = props.order.shipping
  if (s.method === 'pickup') {
    return [
      { label: 'Método', value: shippingLabels.pickup },
      { label: 'Retira', value: s.receiverName },
      { label: 'Teléfono', value: s.receiverPhone, copy: true },
    ]
  }
  return [
    { label: 'Método', value: shippingLabels.delivery },
    { label: 'Recibe', value: s.receiverName, copy: true },
    { label: 'Teléfono', value: s.receiverPhone, copy: true },
    { label: 'Ciudad', value: [s.city, s.province].filter(Boolean).join(', ') },
    { label: 'Dirección', value: s.address, copy: true },
    { label: 'Referencia', value: s.reference },
  ]
})

const invoice = computed<InfoRow[]>(() => {
  const i = props.order.invoice
  return [
    { label: 'Razón social', value: i.name, copy: true },
    { label: 'Cédula / RUC', value: i.documentId, copy: true },
    { label: 'Correo', value: i.email, copy: true },
    { label: 'Dirección', value: i.address, copy: true },
  ]
})

// Bloque listo para pegar en el guía de Servientrega.
function copyShipping() {
  const s = props.order.shipping
  copy(
    [s.receiverName, s.receiverPhone, `${s.address}`, s.reference, `${s.city}, ${s.province}`]
      .filter(Boolean)
      .join('\n'),
    'Datos de envío copiados',
  )
}

function copyInvoice() {
  const i = props.order.invoice
  copy([i.name, i.documentId, i.email, i.address].filter(Boolean).join('\n'), 'Datos de factura copiados')
}
</script>

<template>
  <article class="adm-card">
    <h2 class="adm-card__title">Cliente <i class="fa-solid fa-user"></i></h2>
    <AdminInfoRows :rows="customer" />
  </article>

  <article class="adm-card">
    <h2 class="adm-card__title">
      Entrega
      <button v-if="order.shipping.method === 'delivery'" type="button" class="adm-btn adm-btn--ghost adm-btn--sm" @click="copyShipping">
        <i class="fa-regular fa-copy"></i> Copiar todo
      </button>
    </h2>
    <AdminInfoRows :rows="shipping" />
  </article>

  <article v-if="order.invoice?.required" class="adm-card invoice">
    <h2 class="adm-card__title">
      Factura SRI
      <button type="button" class="adm-btn adm-btn--ghost adm-btn--sm" @click="copyInvoice">
        <i class="fa-regular fa-copy"></i> Copiar todo
      </button>
    </h2>
    <p class="invoice__note"><i class="fa-solid fa-file-invoice"></i> El cliente pidió factura. Emítela en el SRI con estos datos.</p>
    <AdminInfoRows :rows="invoice" />
  </article>
</template>

<style scoped lang="scss">
.invoice {
  border-color: $accent;

  &__note {
    font-size: $text-sm;
    background: $accent-soft;
    border-radius: 8px;
    padding: 0.55rem 0.8rem;
    margin-bottom: 0.9rem;

    i {
      color: $accent-deep;
      margin-right: 0.3rem;
    }
  }
}
</style>
