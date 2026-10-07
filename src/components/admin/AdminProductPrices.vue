<script setup lang="ts">
import type { ProductPayload } from '@/services/admin.service'
import AdminMoneyInput from './AdminMoneyInput.vue'

const form = defineModel<ProductPayload>({ required: true })
defineProps<{ warning?: string }>()
</script>

<template>
  <article class="adm-card">
    <h2 class="adm-card__title">Precios <i class="fa-solid fa-tag"></i></h2>
    <p class="adm-muted prices__hint">En dólares. Cada método de pago tiene su propio precio.</p>
    <div class="adm-fields">
      <AdminMoneyInput id="p-card" v-model="form.prices.card" label="Tarjeta (Payphone)" hint="El más bajo" />
      <AdminMoneyInput id="p-transfer" v-model="form.prices.transfer" label="Transferencia" />
      <AdminMoneyInput id="p-cod" v-model="form.prices.cod" label="Contra entrega" hint="El más alto" />
    </div>
    <p v-if="warning" class="prices__warn"><i class="fa-solid fa-triangle-exclamation"></i> {{ warning }}</p>
    <div class="adm-fields prices__extra">
      <AdminMoneyInput
        id="p-compare"
        v-model="form.compareAtPrice"
        optional
        label="Precio anterior"
        hint="Se muestra tachado"
      />
      <AdminMoneyInput
        id="p-dist"
        v-model="form.distributorPrice"
        optional
        label="Precio distribuidor"
        hint="Solo lo ven distribuidores"
      />
    </div>
  </article>
</template>

<style scoped lang="scss">
.prices {
  &__hint {
    margin-bottom: 0.8rem;
  }

  &__warn {
    margin-top: 0.8rem;
    font-size: $text-sm;
    color: darken($warning, 16%);
    background: $warning-bg;
    padding: 0.5rem 0.8rem;
    border-radius: 8px;
  }

  &__extra {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px dashed $line;
  }
}
</style>
