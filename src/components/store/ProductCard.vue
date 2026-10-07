<script setup lang="ts">
import { computed } from 'vue'
import { copy } from '@/config/copy'
import { money } from '@/utils/format'
import { unitPrice } from '@/utils/pricing'
import { useUserStore } from '@/stores/user'
import { useAddToCart } from '@/composables/useAddToCart'
import type { Product } from '@/types'

const props = defineProps<{ product: Product }>()

const user = useUserStore()
const { add } = useAddToCart()

const soldOut = computed(() => props.product.stock <= 0)
const isDistributorPrice = computed(() => user.isDistributor && Boolean(props.product.distributorPrice))
const price = computed(() => unitPrice(props.product, 'card', 1, user.isDistributor))
const image = computed(() => props.product.images?.[0] || '')
const hasTiers = computed(() => (props.product.volumeTiers?.length || 0) > 0)
</script>

<template>
  <article class="card" :class="{ 'card--out': soldOut }">
    <RouterLink :to="`/producto/${product.slug}`" class="card__media">
      <img v-if="image" :src="image" :alt="product.name" loading="lazy" />
      <i v-else class="fa-solid fa-futbol card__placeholder"></i>
      <span v-if="soldOut" class="card__flag card__flag--out">{{ copy.product.soldOut }}</span>
      <span v-else-if="hasTiers && !isDistributorPrice" class="card__flag">
        <i class="fa-solid fa-layer-group"></i> {{ copy.product.tiersTitle }}
      </span>
    </RouterLink>

    <div class="card__body">
      <RouterLink :to="`/producto/${product.slug}`" class="card__name">{{ product.name }}</RouterLink>
      <div class="card__row">
        <div class="card__price">
          <strong>{{ money(price) }}</strong>
          <span>{{ isDistributorPrice ? copy.product.distributorLabel : copy.product.cardLabel }}</span>
        </div>
        <button
          class="card__add"
          type="button"
          :disabled="soldOut"
          :aria-label="`${copy.product.add}: ${product.name}`"
          @click="add(product)"
        >
          <i class="fa-solid fa-bag-shopping"></i>
        </button>
      </div>
      <s v-if="product.compareAtPrice && product.compareAtPrice > price" class="card__compare">
        {{ money(product.compareAtPrice) }}
      </s>
    </div>
  </article>
</template>

<style scoped lang="scss">
.card {
  @include flex(column, stretch, flex-start);
  background: $paper;
  min-width: 0;

  &__media {
    position: relative;
    display: block;
    aspect-ratio: 1;
    background: $sand;
    overflow: hidden;
    @include flex(row, center, center);

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 8%;
      mix-blend-mode: multiply;
      transition: transform 0.5s $ease;
    }
  }

  &:hover &__media img {
    transform: scale(1.06) rotate(-3deg);
  }

  &__placeholder {
    font-size: 3rem;
    color: $line;
  }

  &__flag {
    position: absolute;
    top: 0.7rem;
    left: 0.7rem;
    font-family: $font-condensed;
    font-weight: 700;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: $ink;
    color: $accent;
    padding: 0.2rem 0.55rem;
    transform: skewX(-12deg);

    &--out {
      background: $paper;
      color: $ink;
      border: 1px solid $ink;
    }
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.4rem);
    padding: 0.85rem 0.1rem 0.4rem;
  }

  &__name {
    font-weight: 600;
    font-size: $text-sm;
    line-height: 1.3;
    color: $ink;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 2.6em;
  }

  &__row {
    @include flex(row, flex-end, space-between, 0.5rem);
  }

  &__price {
    @include flex(column, flex-start, flex-start);

    strong {
      font-family: $font-display;
      font-weight: 400;
      font-size: 1.7rem;
      line-height: 1;
    }

    span {
      font-family: $font-condensed;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: $ink-muted;
    }
  }

  &__compare {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__add {
    width: 2.6rem;
    height: 2.6rem;
    flex-shrink: 0;
    border-radius: 4px;
    background: $ink;
    color: $paper;
    @include flex(row, center, center);
    @include transition;

    &:hover:not(:disabled) {
      background: $accent;
      color: $on-accent;
    }

    &:disabled {
      opacity: 0.25;
      cursor: not-allowed;
    }
  }

  &--out &__media img {
    opacity: 0.45;
  }
}
</style>
