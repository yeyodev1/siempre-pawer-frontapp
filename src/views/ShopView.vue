<script setup lang="ts">
import { ref, watch } from 'vue'
import { useShop } from '@/composables/useShop'
import { copy } from '@/config/copy'
import ProductGrid from '@/components/store/ProductGrid.vue'
import StateBlock from '@/components/store/StateBlock.vue'

const {
  products, categories, category, currentCategory, search, sub, sort, total,
  loading, loadingMore, error, hasMore, reload, loadMore, setSort, setSub, setSearch,
} = useShop()

const term = ref('')
watch(search, (value) => (term.value = value), { immediate: true })
</script>

<template>
  <div class="shop">
    <nav class="shop__crumbs" aria-label="Ruta">
      <RouterLink to="/">Inicio</RouterLink>
      <span>/</span>
      <RouterLink v-if="currentCategory" to="/tienda">{{ copy.shop.title }}</RouterLink>
      <span v-if="currentCategory">/</span>
      <span class="shop__crumb-current">{{ currentCategory?.name || copy.shop.title }}</span>
    </nav>

    <h1 class="shop__title">{{ currentCategory?.name || copy.shop.title }}</h1>

    <form class="shop__search" role="search" @submit.prevent="setSearch(term)">
      <i class="fa-solid fa-magnifying-glass"></i>
      <label for="shop-search" class="visually-hidden">{{ copy.shop.searchLabel }}</label>
      <input
        id="shop-search"
        v-model="term"
        type="search"
        autocomplete="off"
        :placeholder="currentCategory ? `Buscar en ${currentCategory.name}` : copy.shop.searchPlaceholder"
      />
      <button v-if="search" type="button" class="shop__clear" aria-label="Quitar búsqueda" @click="setSearch('')">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </form>

    <!-- Dentro de una categoría las pestañas son sus subcategorías; en la tienda, las categorías. -->
    <nav v-if="currentCategory" class="shop__tabs" aria-label="Subcategorías">
      <button type="button" class="tab" :class="{ 'tab--active': !sub }" @click="setSub('')">{{ copy.shop.all }}</button>
      <button
        v-for="s in currentCategory.subcategories || []"
        :key="s"
        type="button"
        class="tab"
        :class="{ 'tab--active': sub === s }"
        @click="setSub(s)"
      >
        {{ s }}
      </button>
    </nav>
    <nav v-else class="shop__tabs" aria-label="Categorías">
      <RouterLink to="/tienda" class="tab" :class="{ 'tab--active': !category }">{{ copy.shop.all }}</RouterLink>
      <RouterLink v-for="c in categories" :key="c._id" :to="`/tienda/${c.slug}`" class="tab">{{ c.name }}</RouterLink>
    </nav>

    <div class="shop__bar">
      <span v-if="!loading && !error" class="shop__count">{{ total }} productos</span>
      <label for="shop-sort" class="visually-hidden">{{ copy.shop.sortLabel }}</label>
      <select id="shop-sort" :value="sort" @change="setSort(($event.target as HTMLSelectElement).value)">
        <option v-for="o in copy.shop.sort" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
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
  padding-block: 1.25rem $space-xl;

  &__crumbs {
    @include flex(row, center, flex-start, 0.4rem);
    font-size: $text-sm;
    color: $ink-muted;

    a:hover {
      color: $ink;
    }
  }

  &__crumb-current {
    color: $ink;
    font-weight: 600;
  }

  &__title {
    font-family: $font-display;
    font-weight: 400;
    font-style: italic;
    font-size: clamp(2.6rem, 2rem + 3vw, 4.5rem);
    line-height: 1;
    text-transform: uppercase;
    margin-block: 0.4rem 0.9rem;
  }

  &__search {
    position: relative;
    max-width: 560px;

    > i {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: $ink-muted;
    }

    input {
      background: $sand;
      border-color: transparent;
      border-radius: $radius-pill;
      padding: 0.7rem 2.8rem;
    }
  }

  &__clear {
    position: absolute;
    right: 0.4rem;
    top: 50%;
    transform: translateY(-50%);
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    @include flex(row, center, center);
  }

  &__tabs {
    @include flex(row, stretch, flex-start, 1.4rem);
    overflow-x: auto;
    scrollbar-width: none;
    border-bottom: 1px solid $line;
    margin-top: 1.1rem;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__bar {
    @include flex(row, center, space-between, 0.75rem);
    padding-block: 0.9rem 1.25rem;

    select {
      width: auto;
      margin-left: auto;
      padding-block: 0.45rem;
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

// Pestañas subrayadas, como el filtro de categorías de una app de delivery.
.tab {
  flex-shrink: 0;
  font-family: $font-condensed;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.04em;
  white-space: nowrap;
  padding: 0.6rem 0 0.55rem;
  color: $ink-muted;
  border-bottom: 3px solid transparent;
  margin-bottom: -1px;
  @include transition;

  &:hover {
    color: $ink;
  }

  &--active {
    color: $ink;
    border-bottom-color: $accent;
  }
}
</style>
