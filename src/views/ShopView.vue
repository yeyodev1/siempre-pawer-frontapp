<script setup lang="ts">
import { useShop } from '@/composables/useShop'
import { copy } from '@/config/copy'
import SectionHead from '@/components/store/SectionHead.vue'
import ProductGrid from '@/components/store/ProductGrid.vue'
import StateBlock from '@/components/store/StateBlock.vue'

const {
  products, categories, category, currentCategory, search, sort, total,
  loading, loadingMore, error, hasMore, reload, loadMore, setSort,
} = useShop()
</script>

<template>
  <div class="shop">
    <header class="shop__head">
      <SectionHead
        as="h1"
        :eyebrow="copy.shop.eyebrow"
        :title="currentCategory?.name || copy.shop.title"
      >
        <p v-if="search" class="shop__query">
          {{ copy.shop.resultsFor }} <strong>"{{ search }}"</strong>
          <RouterLink :to="{ query: {} }" class="shop__clear" aria-label="Quitar búsqueda">
            <i class="fa-solid fa-xmark"></i>
          </RouterLink>
        </p>
        <p v-else-if="currentCategory?.description" class="shop__desc">{{ currentCategory.description }}</p>
      </SectionHead>
    </header>

    <div class="shop__bar">
      <nav class="shop__chips" aria-label="Categorías">
        <RouterLink to="/tienda" class="chip" :class="{ 'chip--active': !category }">{{ copy.shop.all }}</RouterLink>
        <RouterLink
          v-for="c in categories"
          :key="c._id"
          :to="`/tienda/${c.slug}`"
          class="chip"
          :class="{ 'chip--active': category === c.slug }"
        >
          {{ c.name }}
        </RouterLink>
      </nav>

      <div class="shop__sort">
        <span v-if="!loading && !error" class="shop__count">{{ total }} productos</span>
        <label for="shop-sort" class="visually-hidden">{{ copy.shop.sortLabel }}</label>
        <select id="shop-sort" :value="sort" @change="setSort(($event.target as HTMLSelectElement).value)">
          <option v-for="o in copy.shop.sort" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
      </div>
    </div>

    <div class="shop__body">
      <StateBlock v-if="loading" state="loading" />
      <StateBlock v-else-if="error" state="error" @retry="reload" />
      <StateBlock v-else-if="!products.length" state="empty" :message="copy.shop.empty">
        <RouterLink to="/tienda" class="btn btn--dark btn--sport">{{ copy.shop.emptyCta }}</RouterLink>
      </StateBlock>
      <template v-else>
        <ProductGrid :products="products" />
        <button v-if="hasMore" class="btn btn--ghost btn--sport shop__more" :disabled="loadingMore" @click="loadMore">
          <i v-if="loadingMore" class="fa-solid fa-spinner fa-spin"></i>
          {{ copy.shop.loadMore }}
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.shop {
  @include container(1280px);
  padding-block: 2rem $space-xl;

  &__head {
    padding-bottom: 1.5rem;
  }

  &__query,
  &__desc {
    color: $ink-soft;
    @include flex(row, center, flex-start, 0.5rem);
  }

  &__clear {
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    background: $sand;
    @include flex(row, center, center);
    font-size: 0.75rem;
  }

  &__bar {
    @include flex(column, stretch, flex-start, 1rem);
    border-block: 1px solid $line;
    padding-block: 0.9rem;
    margin-bottom: 1.75rem;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__chips {
    @include flex(row, center, flex-start, 0.5rem);
    overflow-x: auto;
    scrollbar-width: none;
    margin-inline: -1.25rem;
    padding-inline: 1.25rem;

    @include from('md') {
      flex-wrap: wrap;
      margin: 0;
      padding: 0;
    }
  }

  &__sort {
    @include flex(row, center, space-between, 0.75rem);
    flex-shrink: 0;

    select {
      width: auto;
      padding-block: 0.5rem;
      font-family: $font-condensed;
      font-weight: 600;
    }
  }

  &__count {
    font-family: $font-condensed;
    font-size: 0.9rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $ink-muted;
  }

  &__body {
    @include flex(column, stretch, flex-start, 2rem);
  }

  &__more {
    align-self: center;
  }
}

.chip {
  flex-shrink: 0;
  font-family: $font-condensed;
  font-weight: 700;
  font-size: 0.92rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.45rem 1rem;
  border: 1.5px solid $ink;
  border-radius: 4px;
  white-space: nowrap;
  @include transition;

  &:hover {
    background: $sand;
  }

  &--active,
  &--active:hover {
    background: $ink;
    color: $accent;
  }
}
</style>
