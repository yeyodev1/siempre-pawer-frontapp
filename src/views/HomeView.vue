<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { catalogService } from '@/services/catalog.service'
import { useCategories } from '@/composables/useCategories'
import { copy } from '@/config/copy'
import HomeHero from '@/components/store/HomeHero.vue'
import BenefitsStrip from '@/components/store/BenefitsStrip.vue'
import CategoryTiles from '@/components/store/CategoryTiles.vue'
import SectionHead from '@/components/store/SectionHead.vue'
import ProductGrid from '@/components/store/ProductGrid.vue'
import StateBlock from '@/components/store/StateBlock.vue'
import WholesaleBand from '@/components/store/WholesaleBand.vue'
import type { Product } from '@/types'

const { categories, load: loadCategories } = useCategories()
const featured = ref<Product[]>([])
const loading = ref(true)
const failed = ref(false)

async function loadFeatured() {
  loading.value = true
  failed.value = false
  try {
    const { items } = await catalogService.products({ featured: true, limit: 8 })
    // Si aún no marcaron destacados, mostramos lo más nuevo.
    featured.value = items.length ? items : (await catalogService.products({ limit: 8 })).items
  } catch {
    failed.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFeatured()
  loadCategories()
})
</script>

<template>
  <div class="home">
    <HomeHero :product="featured[0]" />
    <BenefitsStrip />

    <section v-if="categories.length" class="home__section">
      <SectionHead :eyebrow="copy.home.categoriesEyebrow" :title="copy.home.categoriesTitle" />
      <CategoryTiles :categories="categories" />
    </section>

    <section class="home__section">
      <div class="home__row">
        <SectionHead :eyebrow="copy.home.featuredEyebrow" :title="copy.home.featuredTitle" />
        <RouterLink to="/tienda" class="home__more">
          {{ copy.home.featuredCta }} <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
      </div>
      <StateBlock v-if="loading" state="loading" />
      <StateBlock v-else-if="failed" state="error" @retry="loadFeatured" />
      <StateBlock v-else-if="!featured.length" state="empty" :message="copy.shop.empty" />
      <ProductGrid v-else :products="featured" />
    </section>

    <WholesaleBand />
  </div>
</template>

<style scoped lang="scss">
.home {
  &__section {
    @include container(1280px);
    @include flex(column, stretch, flex-start, 1.75rem);
    padding-block: $space-xl;
  }

  &__row {
    @include flex(row, flex-end, space-between, 1rem);
    flex-wrap: wrap;
  }

  &__more {
    font-family: $font-condensed;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border-bottom: 2px solid $accent;
    padding-bottom: 0.15rem;

    i {
      margin-left: 0.3rem;
      font-size: 0.8em;
    }
  }
}
</style>
