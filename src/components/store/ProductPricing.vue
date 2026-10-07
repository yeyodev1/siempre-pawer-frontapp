<script setup lang="ts">
import { computed } from 'vue'
import { copy } from '@/config/copy'
import { money } from '@/utils/format'
import { sortedTiers } from '@/utils/pricing'
import { useSettingsStore } from '@/stores/settings'
import type { PaymentMethod, Product } from '@/types'

const props = defineProps<{ product: Product; isDistributor: boolean; selected: PaymentMethod }>()

const settings = useSettingsStore()

const showDistributor = computed(() => props.isDistributor && Boolean(props.product.distributorPrice))
const tiers = computed(() => sortedTiers(props.product.volumeTiers))

// Se muestran los tres precios aunque un método esté apagado, salvo que el
// API ya haya dicho que no existe: así nunca se ofrece algo que no se puede pagar.
const rows = computed(() => {
  const s = settings.settings
  const all: { key: PaymentMethod; label: string; on: boolean }[] = [
    { key: 'card', label: copy.product.priceCard, on: !settings.loaded || s.payphoneEnabled },
    { key: 'transfer', label: copy.product.priceTransfer, on: s.transferEnabled },
    { key: 'cod', label: copy.product.priceCod, on: s.codEnabled },
  ]
  return all.filter((r) => r.on)
})
</script>

<template>
  <div class="pricing">
    <div v-if="showDistributor" class="pricing__distributor">
      <span>{{ copy.product.distributorLabel }}</span>
      <strong>{{ money(product.distributorPrice) }}</strong>
    </div>

    <template v-else>
      <div class="pricing__rows">
        <div
          v-for="(row, i) in rows"
          :key="row.key"
          class="pricing__row"
          :class="{ 'pricing__row--best': i === 0 && row.key === 'card', 'pricing__row--selected': row.key === selected }"
        >
          <span class="pricing__label">
            {{ row.label }}
            <em v-if="row.key === 'card'">{{ copy.product.bestPrice }}</em>
          </span>
          <strong class="pricing__value">{{ money(product.prices[row.key]) }}</strong>
        </div>
      </div>
      <s v-if="product.compareAtPrice && product.compareAtPrice > product.prices.card" class="pricing__compare">
        {{ money(product.compareAtPrice) }}
      </s>

      <div v-if="tiers.length" class="pricing__tiers">
        <p class="pricing__tiers-title"><i class="fa-solid fa-layer-group"></i> {{ copy.product.tiersTitle }}</p>
        <p v-for="t in tiers" :key="t.minQty" class="pricing__tier">
          {{ copy.product.tierLine(t.minQty, money(t.unitPrice)) }}
          <small>({{ copy.product.priceCard.toLowerCase() }})</small>
        </p>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.pricing {
  @include flex(column, stretch, flex-start, 0.9rem);

  &__distributor {
    background: $ink;
    color: $paper;
    padding: 1rem 1.2rem;
    @include flex(row, center, space-between, 1rem);

    span {
      font-family: $font-condensed;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-size: 0.85rem;
    }

    strong {
      font-family: $font-display;
      font-weight: 400;
      font-size: 2.4rem;
      line-height: 1;
      color: $accent;
    }
  }

  &__rows {
    @include flex(column, stretch, flex-start);
    border-top: 1px solid $line;
  }

  &__row {
    @include flex(row, center, space-between, 1rem);
    padding: 0.6rem 0;
    border-bottom: 1px solid $line;
    color: $ink-soft;

    &--best {
      color: $ink;
      padding-block: 0.8rem;

      .pricing__value {
        font-size: 2.8rem;
      }
    }

    &--selected .pricing__label::before {
      content: '';
      display: inline-block;
      width: 0.4rem;
      height: 0.9rem;
      background: $accent;
      transform: skewX(-18deg);
      margin-right: 0.45rem;
    }
  }

  &__label {
    font-family: $font-condensed;
    font-weight: 600;
    font-size: 0.95rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;

    em {
      font-style: normal;
      font-size: 0.72rem;
      background: $accent;
      color: $on-accent;
      padding: 0.05rem 0.45rem;
      transform: skewX(-12deg);
    }
  }

  &__value {
    font-family: $font-display;
    font-weight: 400;
    font-size: 1.7rem;
    line-height: 1;
  }

  &__compare {
    color: $ink-muted;
    font-size: $text-sm;
  }

  &__tiers {
    background: $accent-soft;
    border-left: 4px solid $accent;
    padding: 0.85rem 1rem;
    @include flex(column, stretch, flex-start, 0.25rem);
  }

  &__tiers-title {
    font-family: $font-condensed;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-size: 0.85rem;
  }

  &__tier {
    font-weight: 600;
    font-size: $text-sm;

    small {
      font-weight: 400;
      color: $ink-soft;
    }
  }
}
</style>
