<script setup lang="ts">
import { onMounted } from 'vue'
import { useAdminOrders } from '@/composables/useAdminOrders'
import { statusLabels, statusOrder } from '@/composables/useAdminFormat'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminOrderTable from '@/components/admin/AdminOrderTable.vue'
import AdminPager from '@/components/admin/AdminPager.vue'

const { status, search, page, pages, total, orders, loading, load, goTo } = useAdminOrders()

onMounted(load)
</script>

<template>
  <section>
    <AdminPageHeader title="Pedidos" :subtitle="`${total} pedido${total === 1 ? '' : 's'}`" />

    <div class="filters">
      <button
        type="button"
        class="filters__chip"
        :class="{ 'filters__chip--on': status === '' }"
        @click="status = ''"
      >
        Todos
      </button>
      <button
        v-for="s in statusOrder"
        :key="s"
        type="button"
        class="filters__chip"
        :class="{ 'filters__chip--on': status === s }"
        @click="status = s"
      >
        {{ statusLabels[s] }}
      </button>
    </div>

    <div class="adm-toolbar">
      <input v-model="search" type="search" placeholder="Buscar por número, nombre, correo o teléfono" aria-label="Buscar pedidos" />
    </div>

    <div class="adm-card orders__card">
      <p v-if="loading && !orders.length" class="adm-loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</p>
      <p v-else-if="!orders.length" class="adm-empty">
        <i class="fa-solid fa-receipt"></i>
        No hay pedidos con estos filtros
      </p>
      <AdminOrderTable v-else :orders="orders" :class="{ 'orders__dim': loading }" />
      <AdminPager :page="page" :pages="pages" @go="goTo" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.filters {
  @include flex(row, center, flex-start, 0.45rem);
  overflow-x: auto;
  padding-bottom: 0.4rem;
  margin-bottom: 0.6rem;
  scrollbar-width: none;

  &__chip {
    flex: 0 0 auto;
    padding: 0.45rem 0.95rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    background: $surface;
    font-size: 0.82rem;
    font-weight: 600;
    color: $ink-soft;
    @include transition;

    &--on {
      background: $ink;
      border-color: $ink;
      color: $accent;
    }
  }
}

.orders {
  &__card {
    padding: 0.6rem;

    @include from('lg') {
      padding: 0.4rem 0.6rem 1rem;
    }
  }

  &__dim {
    opacity: 0.55;
  }
}
</style>
