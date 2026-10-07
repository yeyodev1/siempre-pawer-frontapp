<script setup lang="ts">
import { computed } from 'vue'
import { copy } from '@/config/copy'
import { site } from '@/config/site'
import { useCheckoutForm } from '@/composables/useCheckoutForm'
import { useSettingsStore } from '@/stores/settings'
import { money } from '@/utils/format'
import CheckoutSection from './CheckoutSection.vue'
import type { ShippingMethod } from '@/types'

const { shipping } = useCheckoutForm()
const settings = useSettingsStore()
const t = copy.checkout

const options = computed(() => {
  const s = settings.settings
  const freeNote = s.freeShippingFrom > 0 ? ` · ${t.free} desde ${money(s.freeShippingFrom)}` : ''
  return [
    { value: 'delivery' as ShippingMethod, icon: 'fa-solid fa-truck-fast', title: t.deliveryHome, hint: t.deliveryHomeHint + freeNote },
    { value: 'pickup' as ShippingMethod, icon: 'fa-solid fa-store', title: t.pickup, hint: s.pickupAddress || t.pickupHint },
  ]
})
</script>

<template>
  <CheckoutSection :title="t.delivery" icon="fa-solid fa-truck">
    <div class="field options" role="radiogroup">
      <label
        v-for="o in options"
        :key="o.value"
        class="option"
        :class="{ 'option--active': shipping.method === o.value }"
      >
        <input v-model="shipping.method" type="radio" name="shipping" :value="o.value" class="visually-hidden" />
        <i :class="o.icon"></i>
        <span><strong>{{ o.title }}</strong><small>{{ o.hint }}</small></span>
      </label>
    </div>

    <template v-if="shipping.method === 'delivery'">
      <div class="field field--half">
        <label for="co-province">{{ t.province }}</label>
        <select id="co-province" v-model="shipping.province" required>
          <option v-for="p in site.provinces" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>
      <div class="field field--half">
        <label for="co-city">{{ t.city }}</label>
        <input id="co-city" v-model="shipping.city" autocomplete="address-level2" required />
      </div>
      <div class="field">
        <label for="co-address">{{ t.address }}</label>
        <input id="co-address" v-model="shipping.address" autocomplete="street-address" required />
      </div>
      <div class="field">
        <label for="co-ref">{{ t.reference }}</label>
        <input id="co-ref" v-model="shipping.reference" :placeholder="t.referencePlaceholder" />
      </div>
      <div class="field field--half">
        <label for="co-receiver">{{ t.receiverName }}</label>
        <input id="co-receiver" v-model="shipping.receiverName" autocomplete="name" />
      </div>
      <div class="field field--half">
        <label for="co-receiver-phone">{{ t.receiverPhone }}</label>
        <input id="co-receiver-phone" v-model="shipping.receiverPhone" type="tel" inputmode="tel" />
      </div>
    </template>
  </CheckoutSection>
</template>

<style scoped lang="scss">
.options {
  @include flex(column, stretch, flex-start, 0.6rem);

  @include from('sm') {
    flex-direction: row;
  }
}

.option {
  flex: 1 1 0;
  @include flex(row, center, flex-start, 0.8rem);
  margin: 0;
  padding: 0.9rem 1rem;
  border: 1.5px solid $line;
  border-radius: 6px;
  cursor: pointer;
  color: $ink;

  &:focus-within {
    outline: 2px solid $accent;
    outline-offset: 2px;
  }

  i {
    font-size: 1.2rem;
  }

  span {
    @include flex(column, flex-start, flex-start);
  }

  strong {
    font-weight: 600;
  }

  small {
    font-size: $text-xs;
    color: $ink-soft;
    font-weight: 400;
  }

  &--active {
    border-color: $ink;
    background: $sand;

    i {
      color: $accent-deep;
    }
  }
}
</style>
