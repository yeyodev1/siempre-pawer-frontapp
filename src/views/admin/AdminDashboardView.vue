<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { cents } from '@/composables/useAdminFormat'
import type { AdminStats, ApiError } from '@/types'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminStatCard from '@/components/admin/AdminStatCard.vue'
import AdminOrderTable from '@/components/admin/AdminOrderTable.vue'

const toast = useToastStore()
const stats = ref<AdminStats | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    stats.value = await adminService.stats()
  } catch (error) {
    toast.error((error as ApiError).message)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section>
    <AdminPageHeader title="Panel" subtitle="Cómo va la tienda hoy">
      <RouterLink :to="{ name: 'AdminProductNew' }" class="adm-btn adm-btn--primary">
        <i class="fa-solid fa-plus"></i> Nuevo producto
      </RouterLink>
    </AdminPageHeader>

    <p v-if="loading" class="adm-loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</p>

    <template v-else-if="stats">
      <div class="dash__stats">
        <AdminStatCard label="Pedidos de hoy" :value="stats.ordersToday" icon="fa-solid fa-bolt" tone="gold" />
        <AdminStatCard label="Ventas del mes" :value="cents(stats.salesMonth)" icon="fa-solid fa-sack-dollar" />
        <AdminStatCard
          label="Pendientes"
          :value="stats.pendingOrders"
          icon="fa-solid fa-hourglass-half"
          :to="{ name: 'AdminOrders', query: { status: 'pending_payment' } }"
        />
        <AdminStatCard
          label="Stock bajo"
          :value="stats.lowStock.length"
          icon="fa-solid fa-triangle-exclamation"
          :tone="stats.lowStock.length ? 'warn' : undefined"
          :to="{ name: 'AdminProducts' }"
        />
      </div>

      <div class="dash__cols">
        <article class="adm-card dash__recent">
          <h2 class="adm-card__title">
            Pedidos recientes
            <RouterLink :to="{ name: 'AdminOrders' }" class="dash__more">Ver todos</RouterLink>
          </h2>
          <AdminOrderTable v-if="stats.recentOrders.length" :orders="stats.recentOrders" />
          <p v-else class="adm-empty"><i class="fa-solid fa-receipt"></i> Aún no hay pedidos</p>
        </article>

        <div class="dash__aside">
          <article class="adm-card">
            <h2 class="adm-card__title">Más vendidos <i class="fa-solid fa-trophy"></i></h2>
            <ol v-if="stats.topProducts.length" class="dash__list">
              <li v-for="(item, i) in stats.topProducts" :key="item.name">
                <span class="dash__rank">{{ i + 1 }}</span>
                <span class="dash__name">{{ item.name }}</span>
                <strong>{{ item.qty }} u.</strong>
              </li>
            </ol>
            <p v-else class="adm-muted">Sin ventas todavía</p>
          </article>

          <article class="adm-card">
            <h2 class="adm-card__title">Stock bajo <i class="fa-solid fa-box-open"></i></h2>
            <ul v-if="stats.lowStock.length" class="dash__list">
              <li v-for="product in stats.lowStock" :key="product._id">
                <img :src="product.images[0]" alt="" class="adm-thumb dash__thumb" />
                <RouterLink :to="{ name: 'AdminProductEdit', params: { id: product._id } }" class="dash__name">
                  {{ product.name }}
                </RouterLink>
                <strong :class="{ 'dash__zero': product.stock === 0 }">{{ product.stock }}</strong>
              </li>
            </ul>
            <p v-else class="adm-muted">Todo con stock suficiente</p>
          </article>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.dash {
  &__stats {
    @include flex-cards(150px, 0.75rem);
    margin-bottom: 1.25rem;

    @include from('md') {
      @include flex-cards(200px, 1rem);
    }
  }

  &__cols {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('xl') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__recent {
    flex: 1 1 auto;
    min-width: 0;
  }

  &__aside {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('xl') {
      flex: 0 0 340px;
    }
  }

  &__more {
    font-family: $font-body;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0;
    text-transform: none;
    color: $ink-soft;
    text-decoration: underline;
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.55rem);

    li {
      @include flex(row, center, flex-start, 0.7rem);
      font-size: 0.9rem;
    }
  }

  &__rank {
    width: 26px;
    height: 26px;
    flex: 0 0 26px;
    border-radius: 50%;
    background: $ink;
    color: $accent;
    font-size: 0.75rem;
    font-weight: 700;
    @include flex(row, center, center);
  }

  &__name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__thumb {
    width: 36px;
    height: 36px;
    flex-basis: 36px;
  }

  &__zero {
    color: $danger;
  }
}
</style>
