<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/config/site'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useSettingsStore } from '@/stores/settings'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useAnalytics } from '@/composables/useAnalytics'
import AnnouncementBar from '@/components/store/AnnouncementBar.vue'
import HeaderSearch from '@/components/store/HeaderSearch.vue'

const route = useRoute()
const userStore = useUserStore()
const cart = useCartStore()
const settings = useSettingsStore()
const analytics = useAnalytics()
const mobileOpen = ref(false)
const logoFailed = ref(false)

useBodyScroll(mobileOpen)

// La SPA no recarga: el PageView se manda en cada cambio de ruta.
watch(
  () => route.path,
  (path) => {
    mobileOpen.value = false
    if (!route.matched.some((r) => r.meta.layout === 'admin')) analytics.pageView(path)
  },
  { immediate: true },
)

onMounted(() => {
  settings.load()
  // El router solo restaura la sesión en rutas protegidas; el distribuidor
  // necesita saberse logueado en toda la tienda para ver sus precios.
  if (userStore.hasToken) userStore.restore()
})
</script>

<template>
  <header class="header">
    <AnnouncementBar />
    <div class="header__inner">
      <button
        class="header__icon header__burger"
        :aria-label="mobileOpen ? 'Cerrar menú' : 'Abrir menú'"
        :aria-expanded="mobileOpen"
        @click="mobileOpen = !mobileOpen"
      >
        <i :class="mobileOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
      </button>

      <RouterLink to="/" class="header__logo" :aria-label="site.name">
        <img v-if="!logoFailed" src="/logo.svg" :alt="site.name" @error="logoFailed = true" />
        <span v-else>{{ site.name }}</span>
      </RouterLink>

      <nav class="header__nav" :class="{ 'header__nav--open': mobileOpen }">
        <div class="header__mobile-search">
          <HeaderSearch @done="mobileOpen = false" />
        </div>
        <RouterLink v-for="link in site.nav" :key="link.to" :to="link.to" class="header__link">
          {{ link.label }}
        </RouterLink>
        <RouterLink v-if="userStore.isAuthenticated" :to="userStore.isAdmin ? '/admin' : '/cuenta'" class="header__link header__link--account">
          <i class="fa-solid fa-user"></i> {{ userStore.isAdmin ? 'Panel' : 'Mi cuenta' }}
        </RouterLink>
      </nav>

      <div class="header__tools">
        <div class="header__search">
          <HeaderSearch />
        </div>
        <RouterLink to="/carrito" class="header__icon header__cart" :aria-label="`Carrito, ${cart.count} productos`">
          <i class="fa-solid fa-bag-shopping"></i>
          <span v-if="cart.count" class="header__badge">{{ cart.count > 99 ? '99+' : cart.count }}</span>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: $paper;
  border-bottom: 1px solid $line;

  &__inner {
    @include container(1280px);
    @include flex(row, center, space-between, 0.75rem);
    height: 64px;
  }

  &__logo {
    @include flex(row, center);
    margin-right: auto;

    img {
      height: 34px;
      width: auto;
    }

    span {
      font-family: $font-display;
      font-size: 1.7rem;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      color: $ink;
    }

    @include until('lg') {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &__nav {
    display: none;

    @include from('lg') {
      @include flex(row, center, flex-start, 1.6rem);
      margin-right: auto;
    }

    &--open {
      @include until('lg') {
        @include flex(column, stretch, flex-start, 0);
        position: fixed;
        inset: 0;
        top: 98px;
        background: $paper;
        padding: 1.25rem;
        z-index: 90;
        overflow-y: auto;
      }
    }
  }

  &__mobile-search {
    margin-bottom: 1rem;

    @include from('lg') {
      display: none;
    }
  }

  &__link {
    font-family: $font-condensed;
    font-weight: 700;
    font-size: 1.05rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $ink;
    padding: 0.9rem 0;
    border-bottom: 1px solid $line;
    position: relative;

    @include from('lg') {
      font-size: 0.95rem;
      padding: 0.3rem 0;
      border: none;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -2px;
        height: 3px;
        background: $accent;
        transform: scaleX(0) skewX(-20deg);
        transform-origin: left;
        @include transition(transform);
      }

      &:hover::after,
      &.router-link-exact-active::after {
        transform: scaleX(1) skewX(-20deg);
      }
    }

    &--account i {
      font-size: 0.8em;
      margin-right: 0.3rem;
    }
  }

  &__tools {
    @include flex(row, center, flex-end, 0.5rem);
  }

  &__search {
    display: none;
    width: 240px;

    @include from('lg') {
      display: block;
    }
  }

  &__icon {
    position: relative;
    width: 2.6rem;
    height: 2.6rem;
    font-size: 1.2rem;
    color: $ink;
    border-radius: 50%;
    @include flex(row, center, center);
    @include transition(background);

    &:hover {
      background: $sand;
    }
  }

  &__burger {
    @include from('lg') {
      display: none;
    }
  }

  &__badge {
    position: absolute;
    top: 0;
    right: -2px;
    min-width: 1.25rem;
    height: 1.25rem;
    padding: 0 0.3rem;
    border-radius: $radius-pill;
    background: $accent;
    color: $on-accent;
    font-family: $font-condensed;
    font-weight: 700;
    font-size: 0.75rem;
    line-height: 1.25rem;
    text-align: center;
  }
}
</style>
