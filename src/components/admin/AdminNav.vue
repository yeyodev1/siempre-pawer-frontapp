<script setup lang="ts">
import { useRoute } from 'vue-router'
import { adminNav } from './adminNav'

const emit = defineEmits<{ navigate: []; logout: [] }>()
const route = useRoute()

// "Pedidos" queda activo también en el detalle; "Panel" solo en su ruta exacta.
function isActive(name: string): boolean {
  if (name === 'AdminDashboard') return route.name === name
  const base = String(name).replace('Admin', '').replace(/s$/, '')
  return String(route.name || '').startsWith(`Admin${base}`)
}
</script>

<template>
  <nav class="nav" aria-label="Panel de administración">
    <RouterLink
      v-for="item in adminNav"
      :key="item.name"
      :to="{ name: item.name }"
      class="nav__link"
      :class="{ 'nav__link--active': isActive(item.name) }"
      @click="emit('navigate')"
    >
      <i :class="item.icon"></i>
      <span>{{ item.label }}</span>
    </RouterLink>
    <hr class="nav__sep" />
    <a href="/" target="_blank" rel="noopener" class="nav__link">
      <i class="fa-solid fa-store"></i>
      <span>Ver tienda</span>
      <i class="fa-solid fa-arrow-up-right-from-square nav__ext"></i>
    </a>
    <button type="button" class="nav__link" @click="emit('logout')">
      <i class="fa-solid fa-right-from-bracket"></i>
      <span>Cerrar sesión</span>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.nav {
  @include flex(column, stretch, flex-start, 0.2rem);

  &__link {
    @include flex(row, center, flex-start, 0.8rem);
    width: 100%;
    padding: 0.75rem 0.9rem;
    border-radius: $radius-sm;
    color: rgba($surface, 0.72);
    font-weight: 500;
    font-size: 0.95rem;
    text-align: left;
    @include transition;
    @include focus-ring;

    > i:first-child {
      width: 1.2rem;
      text-align: center;
      color: rgba($surface, 0.45);
    }

    &:hover {
      background: rgba($surface, 0.06);
      color: $surface;
    }

    &--active {
      background: rgba($accent, 0.12);
      color: $accent;

      > i:first-child {
        color: $accent;
      }
    }
  }

  &__ext {
    margin-left: auto;
    font-size: 0.7rem;
    opacity: 0.5;
  }

  &__sep {
    border: 0;
    border-top: 1px solid rgba($surface, 0.1);
    margin: 0.6rem 0;
  }
}
</style>
