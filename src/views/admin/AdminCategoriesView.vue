<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { adminService, type CategoryPayload } from '@/services/admin.service'
import { useAdminCrud } from '@/composables/useAdminCrud'
import { slugify } from '@/composables/useAdminFormat'
import type { Category } from '@/types'
import BaseModal from '@/components/ui/BaseModal.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminSheet from '@/components/admin/AdminSheet.vue'
import AdminSwitch from '@/components/admin/AdminSwitch.vue'
import AdminImageUploader from '@/components/admin/AdminImageUploader.vue'

const crud = useAdminCrud<Category, CategoryPayload>({
  noun: 'Categoría',
  list: () => adminService.categories(),
  create: (f) => adminService.createCategory(f),
  update: (id, f) => adminService.updateCategory(id, f),
  remove: (id) => adminService.deleteCategory(id),
  blank: () => ({ name: '', slug: '', description: '', image: '', order: 0, isActive: true }),
  toForm: (c) => ({
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    image: c.image || '',
    order: c.order || 0,
    isActive: c.isActive,
  }),
  validate: (f) => (f.name.trim() ? null : 'Escribe el nombre de la categoría'),
})
const { items, loading, saving, sheetOpen, editingId, form, toDelete } = crud

const sorted = computed(() => [...items.value].sort((a, b) => (a.order || 0) - (b.order || 0)))

// El uploader trabaja con listas; la categoría tiene una sola imagen.
const imageList = computed({
  get: () => (form.value.image ? [form.value.image] : []),
  set: (list: string[]) => (form.value.image = list[0] || ''),
})

watch(
  () => form.value.name,
  (name) => {
    if (!editingId.value) form.value.slug = slugify(name)
  },
)

onMounted(crud.load)
</script>

<template>
  <section>
    <AdminPageHeader title="Categorías" subtitle="Ordenan la tienda y el menú">
      <button type="button" class="adm-btn adm-btn--primary" @click="crud.openNew">
        <i class="fa-solid fa-plus"></i> Nueva categoría
      </button>
    </AdminPageHeader>

    <p v-if="loading" class="adm-loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</p>
    <p v-else-if="!items.length" class="adm-empty"><i class="fa-solid fa-layer-group"></i> Aún no hay categorías</p>

    <ul v-else class="cats">
      <li v-for="c in sorted" :key="c._id" class="cats__item adm-card">
        <img v-if="c.image" :src="c.image" alt="" class="cats__img" />
        <span v-else class="cats__img cats__img--empty"><i class="fa-solid fa-image"></i></span>
        <div class="cats__body">
          <strong>{{ c.name }}</strong>
          <small class="adm-muted">/tienda/{{ c.slug }} · orden {{ c.order }}</small>
          <span class="adm-chip" :class="{ 'adm-chip--on': c.isActive }">{{ c.isActive ? 'Activa' : 'Oculta' }}</span>
        </div>
        <div class="cats__tools">
          <button type="button" class="adm-btn adm-btn--ghost adm-btn--icon" aria-label="Editar" @click="crud.openEdit(c)">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button type="button" class="adm-btn adm-btn--danger adm-btn--icon" aria-label="Eliminar" @click="toDelete = c">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </li>
    </ul>

    <AdminSheet
      :open="sheetOpen"
      :title="editingId ? 'Editar categoría' : 'Nueva categoría'"
      :saving="saving"
      @close="sheetOpen = false"
      @save="crud.save"
    >
      <div class="adm-field">
        <label for="c-name">Nombre</label>
        <input id="c-name" v-model="form.name" required placeholder="Ej. Balones de fútbol" />
      </div>
      <div class="adm-field">
        <label for="c-slug">Slug (URL)</label>
        <input id="c-slug" v-model="form.slug" />
      </div>
      <div class="adm-field">
        <label for="c-desc">Descripción</label>
        <textarea id="c-desc" v-model="form.description" rows="3"></textarea>
      </div>
      <AdminImageUploader v-model="imageList" label="Imagen" />
      <div class="adm-field">
        <label for="c-order">Orden</label>
        <input id="c-order" v-model.number="form.order" type="number" inputmode="numeric" />
        <small>Menor número aparece primero.</small>
      </div>
      <AdminSwitch v-model="form.isActive" label="Activa" hint="Visible en la tienda" />
    </AdminSheet>

    <BaseModal
      :open="!!toDelete"
      danger
      title="¿Eliminar categoría?"
      :message="`«${toDelete?.name}» se eliminará. Los productos quedarán sin categoría.`"
      confirm-label="Eliminar"
      @confirm="crud.confirmDelete"
      @cancel="toDelete = null"
    />
  </section>
</template>

<style scoped lang="scss">
.cats {
  list-style: none;
  @include flex-cards(300px, 0.75rem);

  &__item {
    @include flex(row, center, flex-start, 0.9rem);
    padding: 0.8rem;
  }

  &__img {
    width: 64px;
    height: 64px;
    flex: 0 0 64px;
    border-radius: 8px;
    object-fit: cover;

    &--empty {
      @include flex(row, center, center);
      background: $sand;
      color: $ink-muted;
    }
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.15rem);
    flex: 1;
    min-width: 0;
  }

  &__tools {
    @include flex(column, center, flex-start, 0.35rem);
  }
}
</style>
