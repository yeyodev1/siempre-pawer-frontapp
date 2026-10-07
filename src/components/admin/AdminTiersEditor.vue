<script setup lang="ts">
import type { VolumeTier } from '@/types'
import { cents } from '@/composables/useAdminFormat'
import AdminMoneyInput from './AdminMoneyInput.vue'

const tiers = defineModel<VolumeTier[]>({ default: () => [] })
const props = defineProps<{ cardPrice: number }>()

function add() {
  const last = tiers.value[tiers.value.length - 1]
  tiers.value = [...tiers.value, { minQty: last ? last.minQty + 5 : 6, unitPrice: last?.unitPrice || props.cardPrice }]
}

function remove(index: number) {
  tiers.value = tiers.value.filter((_, i) => i !== index)
}

function saving(tier: VolumeTier): string {
  if (!props.cardPrice || !tier.unitPrice || tier.unitPrice >= props.cardPrice) return ''
  return `${Math.round((1 - tier.unitPrice / props.cardPrice) * 100)}% menos`
}
</script>

<template>
  <div class="tiers">
    <p class="adm-muted">
      Precio unitario con tarjeta desde cierta cantidad. Transferencia y contra entrega suman la misma diferencia que en el precio normal.
    </p>
    <ul v-if="tiers.length" class="tiers__list">
      <li v-for="(tier, i) in tiers" :key="i" class="tiers__row">
        <div class="adm-field tiers__qty">
          <label :for="`tier-qty-${i}`">Desde (unid.)</label>
          <input :id="`tier-qty-${i}`" v-model.number="tier.minQty" type="number" min="2" inputmode="numeric" />
        </div>
        <AdminMoneyInput :id="`tier-price-${i}`" v-model="tier.unitPrice" label="Precio unitario" class="tiers__price" />
        <span class="tiers__save">{{ saving(tier) }}</span>
        <button type="button" class="adm-btn adm-btn--ghost adm-btn--icon" aria-label="Quitar escala" @click="remove(i)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </li>
    </ul>
    <button type="button" class="adm-btn adm-btn--ghost adm-btn--sm" @click="add">
      <i class="fa-solid fa-plus"></i> Agregar escala
    </button>
    <small v-if="cardPrice" class="adm-muted">Precio normal con tarjeta: {{ cents(cardPrice) }}</small>
  </div>
</template>

<style scoped lang="scss">
.tiers {
  @include flex(column, flex-start, flex-start, 0.7rem);

  &__list {
    list-style: none;
    width: 100%;
    @include flex(column, stretch, flex-start, 0.6rem);
  }

  &__row {
    @include flex(row, flex-end, flex-start, 0.5rem);
    flex-wrap: wrap;
    padding-bottom: 0.6rem;
    border-bottom: 1px dashed $line;
  }

  &__qty {
    flex: 0 0 110px;
  }

  &__price {
    flex: 1 1 130px;
  }

  &__save {
    flex: 0 0 auto;
    align-self: center;
    font-size: 0.78rem;
    font-weight: 700;
    color: $success;
    min-width: 70px;
  }
}
</style>
