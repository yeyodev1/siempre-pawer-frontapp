<script setup lang="ts">
import { copy } from '@/config/copy'
import { useCheckoutForm } from '@/composables/useCheckoutForm'
import CheckoutSection from './CheckoutSection.vue'

const { customer } = useCheckoutForm()
const t = copy.checkout
</script>

<template>
  <CheckoutSection :title="t.customer" icon="fa-solid fa-user">
    <p class="hint">{{ t.guestNote }}</p>
    <div class="field field--half">
      <label for="co-first">{{ t.firstName }}</label>
      <input id="co-first" v-model="customer.firstName" autocomplete="given-name" required />
    </div>
    <div class="field field--half">
      <label for="co-last">{{ t.lastName }}</label>
      <input id="co-last" v-model="customer.lastName" autocomplete="family-name" required />
    </div>
    <div class="field">
      <label for="co-email">{{ t.email }}</label>
      <input id="co-email" v-model="customer.email" type="email" autocomplete="email" inputmode="email" required />
    </div>
    <div class="field field--half">
      <label for="co-phone">{{ t.phone }}</label>
      <input
        id="co-phone"
        v-model="customer.phone"
        type="tel"
        autocomplete="tel"
        inputmode="tel"
        pattern="[0-9+ ]{7,15}"
        placeholder="09"
        required
      />
    </div>
    <div class="field field--half">
      <label for="co-doc">{{ t.documentId }}</label>
      <input id="co-doc" v-model="customer.documentId" inputmode="numeric" pattern="[0-9]{10,13}" required />
    </div>
  </CheckoutSection>
</template>
