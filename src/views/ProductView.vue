<script setup lang="ts">
import { computed } from 'vue'
import { useProductDetail } from '@/composables/useProductDetail'
import { copy } from '@/config/copy'
import { site } from '@/config/site'
import { money } from '@/utils/format'
import ProductGallery from '@/components/store/ProductGallery.vue'
import ProductPricing from '@/components/store/ProductPricing.vue'
import ProductDetails from '@/components/store/ProductDetails.vue'
import ProductGrid from '@/components/store/ProductGrid.vue'
import QtyStepper from '@/components/store/QtyStepper.vue'
import SectionHead from '@/components/store/SectionHead.vue'
import StateBlock from '@/components/store/StateBlock.vue'

const { product, loading, error, notFound, qty, soldOut, related, currentUnit, whatsapp, load, addToCart, isDistributor, method } =
  useProductDetail()

const categoryName = computed(() => {
  const c = product.value?.category
  return c && typeof c === 'object' ? c : null
})
const stockLabel = computed(() => {
  const stock = product.value?.stock ?? 0
  if (stock <= 0) return copy.product.soldOut
  return stock <= 5 ? `${copy.product.lowStock} (${stock})` : copy.product.inStock
})
</script>

<template>
  <div class="pdp">
    <StateBlock v-if="loading" state="loading" />
    <StateBlock v-else-if="notFound" state="empty" :message="copy.product.notFound">
      <RouterLink to="/tienda" class="btn btn--dark btn--sport">{{ copy.shop.emptyCta }}</RouterLink>
    </StateBlock>
    <StateBlock v-else-if="error || !product" state="error" @retry="load" />

    <template v-else>
      <nav class="pdp__crumbs" aria-label="Ruta">
        <RouterLink to="/tienda">{{ copy.shop.title }}</RouterLink>
        <template v-if="categoryName">
          <i class="fa-solid fa-chevron-right"></i>
          <RouterLink :to="`/tienda/${categoryName.slug}`">{{ categoryName.name }}</RouterLink>
        </template>
      </nav>

      <div class="pdp__top">
        <ProductGallery class="pdp__gallery" :images="product.images || []" :name="product.name" />

        <div class="pdp__buy">
          <p v-if="product.sku" class="pdp__sku">SKU {{ product.sku }}</p>
          <h1 class="pdp__name">{{ product.name }}</h1>
          <p v-if="product.shortDescription" class="pdp__short">{{ product.shortDescription }}</p>

          <ProductPricing :product="product" :is-distributor="isDistributor" :selected="method" />

          <p class="pdp__stock" :class="{ 'pdp__stock--out': soldOut }">
            <i :class="soldOut ? 'fa-solid fa-circle-xmark' : 'fa-solid fa-circle-check'"></i> {{ stockLabel }}
          </p>

          <div class="pdp__actions">
            <div class="pdp__qty">
              <span class="pdp__qty-label">{{ copy.product.qtyLabel }}</span>
              <QtyStepper v-model="qty" :max="product.stock" />
            </div>
            <p v-if="!soldOut && qty > 1" class="pdp__unit">
              {{ qty }} x {{ money(currentUnit) }} = <strong>{{ money(currentUnit * qty) }}</strong>
            </p>
            <button class="btn btn--primary btn--sport btn--lg btn--block" :disabled="soldOut" @click="addToCart">
              <i class="fa-solid fa-bag-shopping"></i>
              {{ soldOut ? copy.product.soldOut : copy.product.add }}
            </button>
            <a v-if="site.whatsapp" :href="whatsapp" target="_blank" rel="noopener" class="btn btn--whatsapp btn--sport btn--block">
              <i class="fa-brands fa-whatsapp"></i> {{ copy.product.whatsapp }}
            </a>
          </div>
        </div>
      </div>

      <ProductDetails class="pdp__details" :product="product" />

      <section v-if="related.length" class="pdp__related">
        <SectionHead :title="copy.product.related" />
        <ProductGrid :products="related" />
      </section>
    </template>
  </div>
</template>

<style scoped lang="scss">
.pdp {
  @include container(1280px);
  padding-block: 1.25rem $space-xl;

  &__crumbs {
    @include flex(row, center, flex-start, 0.5rem);
    font-family: $font-condensed;
    font-weight: 600;
    font-size: 0.9rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $ink-muted;
    margin-bottom: 1.25rem;

    i {
      font-size: 0.6rem;
    }

    a:hover {
      color: $ink;
    }
  }

  &__top {
    @include flex(column, stretch, flex-start, 1.75rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
      gap: 3rem;
    }
  }

  &__gallery {
    flex: 1 1 55%;
    min-width: 0;

    @include from('md') {
      position: sticky;
      top: 120px;
    }
  }

  &__buy {
    flex: 1 1 45%;
    min-width: 0;
    @include flex(column, stretch, flex-start, 1.1rem);
  }

  &__sku {
    font-family: $font-condensed;
    font-size: 0.85rem;
    letter-spacing: 0.1em;
    color: $ink-muted;
  }

  &__name {
    font-family: $font-display;
    font-weight: 400;
    font-size: clamp(2.4rem, 1.8rem + 2.5vw, 3.8rem);
    line-height: 0.92;
    text-transform: uppercase;
  }

  &__short {
    color: $ink-soft;
  }

  &__stock {
    font-weight: 600;
    font-size: $text-sm;
    color: $success;

    &--out {
      color: $danger;
    }
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.75rem);
  }

  &__qty {
    @include flex(row, center, space-between, 1rem);
  }

  &__qty-label {
    font-family: $font-condensed;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__unit {
    font-size: $text-sm;
    color: $ink-soft;
    text-align: right;
  }

  &__details {
    margin-top: $space-xl;
    max-width: 760px;
  }

  &__related {
    margin-top: $space-xl;
    @include flex(column, stretch, flex-start, 1.5rem);
  }
}
</style>
