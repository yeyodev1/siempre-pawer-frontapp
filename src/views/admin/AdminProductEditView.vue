<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminProductForm } from '@/composables/useAdminProductForm'
import BaseModal from '@/components/ui/BaseModal.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminProductBasics from '@/components/admin/AdminProductBasics.vue'
import AdminProductPrices from '@/components/admin/AdminProductPrices.vue'
import AdminImageUploader from '@/components/admin/AdminImageUploader.vue'
import AdminTiersEditor from '@/components/admin/AdminTiersEditor.vue'
import AdminListEditor from '@/components/admin/AdminListEditor.vue'
import AdminSpecsEditor from '@/components/admin/AdminSpecsEditor.vue'
import AdminSwitch from '@/components/admin/AdminSwitch.vue'

const route = useRoute()
const id = route.params.id ? String(route.params.id) : undefined
const { form, categories, loading, saving, confirmDelete, slugTouched, problems, load, save, remove } =
  useAdminProductForm(id)

const priceWarning = computed(() => problems.value.find((p) => p.startsWith('Revisa')))

onMounted(load)
</script>

<template>
  <section>
    <AdminPageHeader :title="id ? 'Editar producto' : 'Nuevo producto'" :subtitle="id ? form.name : undefined" back="/admin/productos">
      <a v-if="id && form.isPublished" :href="`/producto/${form.slug}`" target="_blank" rel="noopener" class="adm-btn adm-btn--ghost">
        <i class="fa-solid fa-eye"></i> Ver
      </a>
      <button v-if="id" type="button" class="adm-btn adm-btn--danger" @click="confirmDelete = true">
        <i class="fa-solid fa-trash-can"></i> Eliminar
      </button>
    </AdminPageHeader>

    <p v-if="loading" class="adm-loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</p>

    <form v-else class="editor" @submit.prevent="save">
      <div class="editor__main adm-stack">
        <AdminProductBasics v-model="form" v-model:slug-touched="slugTouched" :categories="categories" />

        <article class="adm-card">
          <h2 class="adm-card__title">Fotos <i class="fa-solid fa-images"></i></h2>
          <AdminImageUploader v-model="form.images" multiple />
          <small class="adm-muted">La primera es la principal. Usa las flechas para reordenar.</small>
        </article>

        <AdminProductPrices v-model="form" :warning="priceWarning" />

        <article class="adm-card">
          <h2 class="adm-card__title">Descuento por volumen <i class="fa-solid fa-boxes-stacked"></i></h2>
          <AdminTiersEditor v-model="form.volumeTiers" :card-price="form.prices.card" />
        </article>

        <article class="adm-card adm-stack">
          <h2 class="adm-card__title">Detalles <i class="fa-solid fa-list-check"></i></h2>
          <AdminListEditor v-model="form.features" label="Características" placeholder="Ej. Costura térmica" add-label="Agregar característica" />
          <AdminSpecsEditor v-model="form.specs" />
        </article>
      </div>

      <aside class="editor__side adm-stack">
        <article class="adm-card adm-stack">
          <h2 class="adm-card__title">Inventario y visibilidad <i class="fa-solid fa-warehouse"></i></h2>
          <div class="adm-field">
            <label for="p-stock">Stock disponible</label>
            <input id="p-stock" v-model.number="form.stock" type="number" min="0" inputmode="numeric" />
          </div>
          <AdminSwitch v-model="form.isPublished" label="Publicado" hint="Visible en la tienda" />
          <AdminSwitch v-model="form.isFeatured" label="Destacado" hint="Aparece en el inicio" />
          <div class="adm-field">
            <label for="p-order">Orden</label>
            <input id="p-order" v-model.number="form.order" type="number" inputmode="numeric" />
            <small>Menor número aparece primero.</small>
          </div>
        </article>

        <button type="submit" class="adm-btn adm-btn--primary editor__save editor__save--desk" :disabled="saving">
          <i :class="saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-check'"></i>
          {{ id ? 'Guardar cambios' : 'Crear producto' }}
        </button>
      </aside>

      <div class="editor__bar">
        <button type="submit" class="adm-btn adm-btn--primary editor__save" :disabled="saving">
          <i :class="saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-check'"></i>
          {{ id ? 'Guardar cambios' : 'Crear producto' }}
        </button>
      </div>
    </form>

    <BaseModal
      :open="confirmDelete"
      danger
      title="¿Eliminar producto?"
      message="Se borrará del catálogo. Si solo quieres ocultarlo, desactiva «Publicado»."
      confirm-label="Eliminar"
      @confirm="remove"
      @cancel="confirmDelete = false"
    />
  </section>
</template>

<style scoped lang="scss">
.editor {
  @include flex(column, stretch, flex-start, 1rem);

  &__main {
    min-width: 0;
  }

  // En el celular el botón de guardar queda fijo sobre la barra inferior.
  &__bar {
    position: sticky;
    bottom: calc(70px + env(safe-area-inset-bottom));
    z-index: 5;
  }

  &__save {
    width: 100%;
    box-shadow: $shadow-md;

    &--desk {
      display: none;
    }
  }

  @include from('lg') {
    flex-direction: row;
    align-items: flex-start;

    &__main {
      flex: 1 1 auto;
    }

    &__side {
      flex: 0 0 300px;
      position: sticky;
      top: 1.5rem;
    }

    &__bar {
      display: none;
    }

    &__save--desk {
      display: flex;
    }
  }
}
</style>
