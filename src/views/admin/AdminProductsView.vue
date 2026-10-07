<script setup lang="ts">
import { onMounted } from 'vue'
import { useAdminProducts } from '@/composables/useAdminProducts'
import { cents } from '@/composables/useAdminFormat'
import type { Category } from '@/types'
import BaseModal from '@/components/ui/BaseModal.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminPager from '@/components/admin/AdminPager.vue'
import AdminSwitch from '@/components/admin/AdminSwitch.vue'
import AdminStockInput from '@/components/admin/AdminStockInput.vue'

const {
  products,
  categories,
  search,
  category,
  page,
  pages,
  total,
  loading,
  toDelete,
  load,
  loadCategories,
  goTo,
  quickUpdate,
  confirmDelete,
} = useAdminProducts()

function categoryName(value: Category | string | null | undefined): string {
  if (!value) return 'Sin categoría'
  if (typeof value === 'string') return categories.value.find((c) => c._id === value)?.name || ''
  return value.name
}

onMounted(() => {
  load()
  loadCategories()
})
</script>

<template>
  <section>
    <AdminPageHeader title="Productos" :subtitle="`${total} en el catálogo`">
      <RouterLink :to="{ name: 'AdminProductNew' }" class="adm-btn adm-btn--primary">
        <i class="fa-solid fa-plus"></i> Nuevo producto
      </RouterLink>
    </AdminPageHeader>

    <div class="adm-toolbar">
      <input v-model="search" type="search" placeholder="Buscar por nombre o SKU" aria-label="Buscar productos" />
      <select v-model="category" aria-label="Filtrar por categoría">
        <option value="">Todas las categorías</option>
        <option v-for="c in categories" :key="c._id" :value="c._id">{{ c.name }}</option>
      </select>
    </div>

    <div class="adm-card list">
      <p v-if="loading && !products.length" class="adm-loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</p>
      <div v-else-if="!products.length" class="adm-empty">
        <i class="fa-solid fa-futbol"></i>
        <p>No hay productos todavía</p>
        <RouterLink :to="{ name: 'AdminProductNew' }" class="adm-btn adm-btn--dark adm-btn--sm">Crear el primero</RouterLink>
      </div>

      <div v-else class="adm-table" :class="{ 'list--dim': loading }">
        <div class="adm-table__head">
          <span class="adm-table__cell--main">Producto</span>
          <span class="col-price">Precio tarjeta</span>
          <span class="col-stock">Stock</span>
          <span class="col-flags">Publicado / Destacado</span>
          <span class="col-tools"></span>
        </div>
        <div v-for="p in products" :key="p._id" class="adm-table__row">
          <RouterLink :to="{ name: 'AdminProductEdit', params: { id: p._id } }" class="adm-table__cell adm-table__cell--main prod">
            <img :src="p.images[0]" alt="" class="adm-thumb" loading="lazy" />
            <span class="prod__text">
              <strong>{{ p.name }}</strong>
              <small class="adm-muted">{{ categoryName(p.category) }}<template v-if="p.sku"> · {{ p.sku }}</template></small>
            </span>
          </RouterLink>
          <div class="adm-table__cell col-price" data-label="Tarjeta">{{ cents(p.prices.card) }}</div>
          <div class="adm-table__cell col-stock" data-label="Stock">
            <AdminStockInput :value="p.stock" :label="p.name" @change="(v) => quickUpdate(p, { stock: v })" />
          </div>
          <div class="adm-table__cell col-flags">
            <AdminSwitch :model-value="p.isPublished" label="Publicado" @update:model-value="(v) => quickUpdate(p, { isPublished: v })" />
            <AdminSwitch :model-value="p.isFeatured" label="Destacado" @update:model-value="(v) => quickUpdate(p, { isFeatured: v })" />
          </div>
          <div class="adm-table__cell col-tools">
            <RouterLink :to="{ name: 'AdminProductEdit', params: { id: p._id } }" class="adm-btn adm-btn--ghost adm-btn--icon" aria-label="Editar">
              <i class="fa-solid fa-pen"></i>
            </RouterLink>
            <button type="button" class="adm-btn adm-btn--danger adm-btn--icon" aria-label="Eliminar" @click="toDelete = p">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
      <AdminPager :page="page" :pages="pages" @go="goTo" />
    </div>

    <BaseModal
      :open="!!toDelete"
      danger
      title="¿Eliminar producto?"
      :message="`«${toDelete?.name}» se borrará del catálogo. Si solo quieres ocultarlo, desactiva «Publicado».`"
      confirm-label="Eliminar"
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </section>
</template>

<style scoped lang="scss">
.list {
  padding: 0.6rem;

  &--dim {
    opacity: 0.55;
  }
}

.prod {
  @include flex(row, center, flex-start, 0.75rem);

  &__text {
    @include flex(column, flex-start, flex-start, 0);
    min-width: 0;
  }

  small {
    font-weight: 400;
  }
}

.col-price {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.col-flags {
  @include flex(column, flex-start, flex-start, 0.4rem);
  flex: 1 1 140px;
}

.col-tools {
  @include flex(row, center, flex-end, 0.4rem);
  margin-left: auto;
}

@include from('lg') {
  .col-price {
    flex: 0 0 120px;
  }

  .col-stock {
    flex: 0 0 130px;
  }

  .col-flags {
    flex: 0 0 170px;
  }

  .col-tools {
    flex: 0 0 90px;
  }
}
</style>
