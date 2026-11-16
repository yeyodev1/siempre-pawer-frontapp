<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { adminService } from '@/services/admin.service'
import { waNumber } from '@/composables/useAdminFormat'
import { useToastStore } from '@/stores/toast'
import { formatDateTime } from '@/utils/format'
import type { ApiError, SchoolQuote } from '@/types'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'

const toast = useToastStore()
const items = ref<SchoolQuote[]>([])
const loading = ref(true)
const filter = ref<'' | 'new' | 'answered'>('new')

async function load() {
  loading.value = true
  try {
    items.value = (await adminService.schoolQuotes(filter.value)).items
  } catch (e) {
    toast.error((e as ApiError).message)
  } finally {
    loading.value = false
  }
}

async function toggle(q: SchoolQuote) {
  try {
    const updated = await adminService.setSchoolQuoteStatus(q._id, q.status === 'new' ? 'answered' : 'new')
    // Con filtro activo la cotización sale de la lista; sin filtro solo cambia su chip.
    items.value = filter.value
      ? items.value.filter((i) => i._id !== q._id)
      : items.value.map((i) => (i._id === q._id ? updated : i))
  } catch (e) {
    toast.error((e as ApiError).message)
  }
}

watch(filter, load)
onMounted(load)
</script>

<template>
  <section class="adm-stack">
    <AdminPageHeader title="Cotizaciones" subtitle="Pedidos de colegios y clubes desde /cotizar">
      <select v-model="filter" aria-label="Filtrar cotizaciones">
        <option value="new">Por responder</option>
        <option value="answered">Respondidas</option>
        <option value="">Todas</option>
      </select>
    </AdminPageHeader>

    <p v-if="loading" class="adm-loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</p>
    <p v-else-if="!items.length" class="adm-empty"><i class="fa-solid fa-clipboard-list"></i> No hay cotizaciones aquí</p>

    <article v-for="q in items" v-else :key="q._id" class="adm-card adm-stack quote">
      <header class="quote__head">
        <div>
          <strong>{{ q.institution }}</strong>
          <small class="adm-muted">{{ q.name }} · {{ q.city || 'Sin ciudad' }} · {{ formatDateTime(q.createdAt) }}</small>
        </div>
        <span class="adm-chip" :class="{ 'adm-chip--on': q.status === 'answered' }">
          {{ q.status === 'answered' ? 'Respondida' : 'Por responder' }}
        </span>
      </header>

      <ul v-if="q.items.length" class="quote__items">
        <li v-for="(i, n) in q.items" :key="n"><strong>{{ i.qty }}</strong> × {{ i.name }}</li>
      </ul>
      <p v-if="q.notes" class="adm-muted">{{ q.notes }}</p>

      <div class="quote__actions">
        <a :href="`https://wa.me/${waNumber(q.phone)}`" target="_blank" rel="noopener" class="adm-btn adm-btn--ghost">
          <i class="fa-brands fa-whatsapp"></i> {{ q.phone }}
        </a>
        <a v-if="q.email" :href="`mailto:${q.email}`" class="adm-btn adm-btn--ghost"><i class="fa-solid fa-envelope"></i> {{ q.email }}</a>
        <a v-if="q.fileUrl" :href="q.fileUrl" target="_blank" rel="noopener" class="adm-btn adm-btn--ghost">
          <i class="fa-solid fa-paperclip"></i> Ver lista adjunta
        </a>
        <button type="button" class="adm-btn adm-btn--primary" @click="toggle(q)">
          <i class="fa-solid fa-check"></i> {{ q.status === 'new' ? 'Marcar respondida' : 'Volver a pendiente' }}
        </button>
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
.quote {
  &__head {
    @include flex(row, flex-start, space-between, 1rem);

    div {
      @include flex(column, flex-start, flex-start, 0.15rem);
    }
  }

  &__items {
    margin: 0;
    padding-left: 1.1rem;
    font-size: $text-sm;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }
}
</style>
