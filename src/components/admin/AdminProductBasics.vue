<script setup lang="ts">
import { computed } from 'vue'
import type { Category } from '@/types'
import type { ProductPayload } from '@/services/admin.service'

const form = defineModel<ProductPayload>({ required: true })
const slugTouched = defineModel<boolean>('slugTouched', { default: false })
const props = defineProps<{ categories: Category[] }>()

const subcategories = computed(
  () => props.categories.find((c) => c._id === form.value.category)?.subcategories || [],
)
</script>

<template>
  <article class="adm-card">
    <h2 class="adm-card__title">Información <i class="fa-solid fa-circle-info"></i></h2>
    <div class="adm-stack">
      <div class="adm-field">
        <label for="p-name">Nombre</label>
        <input id="p-name" v-model="form.name" required placeholder="Ej. Balón Pawer Pro N5" />
      </div>
      <div class="adm-fields">
        <div class="adm-field">
          <label for="p-slug">Slug (URL)</label>
          <input id="p-slug" v-model="form.slug" required @input="slugTouched = true" />
          <small>siemprepawer.com/producto/{{ form.slug || '...' }}</small>
        </div>
        <div class="adm-field">
          <label for="p-sku">SKU</label>
          <input id="p-sku" v-model="form.sku" placeholder="Opcional" />
        </div>
      </div>
      <div class="adm-field">
        <label for="p-cat">Categoría</label>
        <select id="p-cat" v-model="form.category">
          <option :value="null">Sin categoría</option>
          <option v-for="c in categories" :key="c._id" :value="c._id">{{ c.name }}</option>
        </select>
      </div>
      <div v-if="subcategories.length || form.subcategory" class="adm-field">
        <label for="p-sub">Subcategoría</label>
        <select id="p-sub" v-model="form.subcategory">
          <option value="">Sin subcategoría</option>
          <option v-if="form.subcategory && !subcategories.includes(form.subcategory)" :value="form.subcategory">
            {{ form.subcategory }}
          </option>
          <option v-for="s in subcategories" :key="s" :value="s">{{ s }}</option>
        </select>
        <small>Es la pestaña donde aparece dentro de la categoría.</small>
      </div>
      <div class="adm-field">
        <label for="p-short">Descripción corta</label>
        <input id="p-short" v-model="form.shortDescription" maxlength="180" placeholder="Una línea que venda el producto" />
      </div>
      <div class="adm-field">
        <label for="p-desc">Descripción larga</label>
        <textarea id="p-desc" v-model="form.description" rows="6"></textarea>
      </div>
    </div>
  </article>
</template>
