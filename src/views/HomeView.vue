<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { catalogService } from '@/services/catalog.service'
import { useCategories } from '@/composables/useCategories'
import { copy } from '@/config/copy'
import { site } from '@/config/site'
import HomeHero from '@/components/store/HomeHero.vue'
import BenefitsStrip from '@/components/store/BenefitsStrip.vue'
import CategoryRail from '@/components/store/CategoryRail.vue'
import SectionHead from '@/components/store/SectionHead.vue'
import ProductGrid from '@/components/store/ProductGrid.vue'
import PromoBand from '@/components/store/PromoBand.vue'
import StateBlock from '@/components/store/StateBlock.vue'
import type { Product } from '@/types'

const { categories, load: loadCategories } = useCategories()
const featured = ref<Product[]>([])
const newest = ref<Product[]>([])
const loading = ref(true)
const failed = ref(false)

const hasUniforms = computed(() => categories.value.some((c) => c.slug === 'uniformes'))
// "Nuevos" sin repetir lo que ya salió en "Los más vendidos".
const newestShown = computed(() => {
  const seen = new Set(featured.value.map((p) => p._id))
  return newest.value.filter((p) => !seen.has(p._id)).slice(0, 6)
})

async function loadProducts() {
  loading.value = true
  failed.value = false
  try {
    const [top, latest] = await Promise.all([
      catalogService.products({ featured: true, limit: 6 }),
      catalogService.products({ sort: 'newest', limit: 12 }),
    ])
    // Si aún no marcaron destacados, mostramos lo más nuevo.
    featured.value = top.items.length ? top.items : latest.items.slice(0, 6)
    newest.value = latest.items
  } catch {
    failed.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProducts()
  loadCategories()
})
</script>

<template>
  <div class="home">
    <section v-if="categories.length" class="home__section home__section--rail">
      <CategoryRail :categories="categories" />
    </section>

    <HomeHero :product="featured[0]" />

    <section class="home__section">
      <div class="home__row">
        <SectionHead :title="site.home.bestSellers" />
        <RouterLink to="/tienda" class="home__more">
          {{ site.home.seeAll }} <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
      </div>
      <StateBlock v-if="loading" state="loading" />
      <StateBlock v-else-if="failed" state="error" @retry="loadProducts" />
      <StateBlock v-else-if="!featured.length" state="empty" :message="copy.shop.empty" />
      <ProductGrid v-else :products="featured" dense />
    </section>

    <section class="home__section">
      <PromoBand
        :eyebrow="site.home.schoolEyebrow"
        :title="site.home.schoolTitle"
        :text="site.home.schoolText"
        :cta="site.home.schoolCta"
        to="/cotizar"
        icon="fa-solid fa-school"
      />
    </section>

    <section v-if="newestShown.length" class="home__section">
      <div class="home__row">
        <SectionHead :title="site.home.newest" />
        <RouterLink to="/tienda?sort=newest" class="home__more">
          {{ site.home.seeAll }} <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
      </div>
      <ProductGrid :products="newestShown" dense />
    </section>

    <section v-if="hasUniforms" class="home__section">
      <PromoBand
        :eyebrow="site.home.uniformsEyebrow"
        :title="site.home.uniformsTitle"
        :cta="site.home.uniformsCta"
        to="/tienda/uniformes"
        icon="fa-solid fa-shirt"
        light
      />
    </section>

    <BenefitsStrip />
  </div>
</template>

<style scoped lang="scss">
.home {
  &__section {
    @include container(1280px);
    @include flex(column, stretch, flex-start, 1.25rem);
    padding-block: 1.25rem;

    @include from('md') {
      padding-block: 2rem;
    }

    &--rail {
      padding-block: 1rem;
    }
  }

  &__row {
    @include flex(row, flex-end, space-between, 1rem);
  }

  &__more {
    flex-shrink: 0;
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
