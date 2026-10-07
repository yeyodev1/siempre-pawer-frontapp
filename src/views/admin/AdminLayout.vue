<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useBodyScroll } from '@/composables/useBodyScroll'
import AdminNav from '@/components/admin/AdminNav.vue'
import AdminLogo from '@/components/admin/AdminLogo.vue'
import { adminNav, adminBottomNav } from '@/components/admin/adminNav'
import '@/components/admin/admin.scss'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const menuOpen = ref(false)
useBodyScroll(menuOpen)

const bottomItems = computed(() => adminNav.filter((item) => adminBottomNav.includes(item.name)))
const firstName = computed(() => (userStore.user?.name || 'Admin').split(' ')[0])

watch(
  () => route.fullPath,
  () => (menuOpen.value = false),
)

function isActive(name: string): boolean {
  if (name === 'AdminDashboard') return route.name === name
  return String(route.name || '').startsWith(name.replace(/s$/, ''))
}

function logout() {
  userStore.clear()
  router.replace({ name: 'Login' })
}
</script>

<template>
  <div class="adm layout">
    <aside class="layout__side">
      <AdminLogo />
      <p class="layout__hello">Hola, {{ firstName }}</p>
      <AdminNav @logout="logout" />
    </aside>

    <header class="layout__top">
      <AdminLogo />
      <button type="button" class="layout__burger" aria-label="Abrir menú" @click="menuOpen = true">
        <i class="fa-solid fa-bars"></i>
      </button>
    </header>

    <main class="layout__main">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>

    <nav class="layout__bottom" aria-label="Accesos rápidos">
      <RouterLink
        v-for="item in bottomItems"
        :key="item.name"
        :to="{ name: item.name }"
        class="layout__tab"
        :class="{ 'layout__tab--active': isActive(item.name) }"
      >
        <i :class="item.icon"></i>
        <span>{{ item.short }}</span>
      </RouterLink>
      <button type="button" class="layout__tab" @click="menuOpen = true">
        <i class="fa-solid fa-ellipsis"></i>
        <span>Menú</span>
      </button>
    </nav>

    <Transition name="fade">
      <div v-if="menuOpen" class="layout__drawer" @click.self="menuOpen = false">
        <div class="layout__drawer-panel">
          <div class="layout__drawer-head">
            <AdminLogo />
            <button type="button" class="layout__burger" aria-label="Cerrar menú" @click="menuOpen = false">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <AdminNav @navigate="menuOpen = false" @logout="logout" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
$side: 252px;

.layout {
  min-height: 100vh;
  background: $sand;

  &__side {
    display: none;
  }

  &__top {
    position: sticky;
    top: 0;
    z-index: 40;
    @include flex(row, center, space-between);
    background: $night;
    padding: 0.7rem 1rem;
  }

  &__burger {
    color: $surface;
    font-size: 1.25rem;
    width: 42px;
    height: 42px;
    @include focus-ring;
  }

  &__main {
    padding: 1.25rem 1rem calc(88px + env(safe-area-inset-bottom));
    max-width: 1240px;
  }

  &__bottom {
    position: fixed;
    inset: auto 0 0 0;
    z-index: 40;
    @include flex(row, stretch, space-around);
    background: $night;
    padding-bottom: env(safe-area-inset-bottom);
    border-top: 1px solid rgba($surface, 0.08);
  }

  &__tab {
    flex: 1;
    @include flex(column, center, center, 0.2rem);
    padding: 0.6rem 0.2rem;
    color: rgba($surface, 0.55);
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.02em;

    i {
      font-size: 1.05rem;
    }

    &--active {
      color: $accent;
    }
  }

  &__drawer {
    position: fixed;
    inset: 0;
    z-index: 60;
    background: $overlay;
  }

  &__drawer-panel {
    background: $night;
    width: min(300px, 86vw);
    height: 100%;
    overflow-y: auto;
    padding: 0.8rem 0.9rem 1.5rem;
  }

  &__drawer-head {
    @include flex(row, center, space-between);
    margin-bottom: 1rem;
  }

  &__hello {
    color: rgba($surface, 0.5);
    font-size: $text-sm;
    margin: 1.2rem 0 1rem 0.9rem;
  }

  @include from('lg') {
    &__top,
    &__bottom {
      display: none;
    }

    &__side {
      display: block;
      position: fixed;
      inset: 0 auto 0 0;
      width: $side;
      background: $night;
      padding: 1.5rem 1rem;
      overflow-y: auto;
    }

    &__main {
      margin-left: $side;
      padding: 2rem 2.5rem 3rem;
    }
  }
}
</style>
