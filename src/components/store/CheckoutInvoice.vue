<script setup lang="ts">
import { copy } from '@/config/copy'
import { useCheckoutForm } from '@/composables/useCheckoutForm'
import CheckoutSection from './CheckoutSection.vue'

const { invoice, customer } = useCheckoutForm()
const t = copy.checkout

// Al pedir factura se precargan los datos del cliente: casi siempre son los mismos.
function toggle(event: Event) {
  invoice.required = (event.target as HTMLInputElement).checked
  if (!invoice.required) return
  invoice.name ||= `${customer.firstName} ${customer.lastName}`.trim()
  invoice.documentId ||= customer.documentId
  invoice.email ||= customer.email
}
</script>

<template>
  <CheckoutSection title="Factura" icon="fa-solid fa-file-invoice">
    <label class="field check">
      <input type="checkbox" :checked="invoice.required" @change="toggle" />
      <span>{{ t.invoiceToggle }}</span>
    </label>
    <template v-if="invoice.required">
      <div class="field">
        <label for="inv-name">{{ t.invoiceName }}</label>
        <input id="inv-name" v-model="invoice.name" required />
      </div>
      <div class="field field--half">
        <label for="inv-doc">{{ t.invoiceDocument }}</label>
        <input id="inv-doc" v-model="invoice.documentId" inputmode="numeric" pattern="[0-9]{10,13}" required />
      </div>
      <div class="field field--half">
        <label for="inv-email">{{ t.invoiceEmail }}</label>
        <input id="inv-email" v-model="invoice.email" type="email" required />
      </div>
      <div class="field">
        <label for="inv-address">{{ t.invoiceAddress }}</label>
        <input id="inv-address" v-model="invoice.address" required />
      </div>
    </template>
  </CheckoutSection>
</template>

<style scoped lang="scss">
.check {
  @include flex(row, center, flex-start, 0.7rem);
  margin: 0;
  font-size: 0.95rem;
  color: $ink;
  cursor: pointer;

  input {
    width: 1.2rem;
    height: 1.2rem;
    accent-color: $ink;
    flex-shrink: 0;
  }
}
</style>
