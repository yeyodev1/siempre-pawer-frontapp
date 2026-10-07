<script setup lang="ts">
import { onMounted } from 'vue'
import { adminService, type DistributorPayload } from '@/services/admin.service'
import { useAdminCrud } from '@/composables/useAdminCrud'
import { waNumber } from '@/composables/useAdminFormat'
import type { Distributor } from '@/types'
import BaseModal from '@/components/ui/BaseModal.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminSheet from '@/components/admin/AdminSheet.vue'
import AdminSwitch from '@/components/admin/AdminSwitch.vue'
import AdminDistributorFields from '@/components/admin/AdminDistributorFields.vue'

// La contraseña solo viaja si se escribió: vacía en edición significa "no cambiarla".
function payload(form: DistributorPayload): DistributorPayload {
  const { password, ...rest } = form
  return password?.trim() ? { ...rest, password: password.trim() } : rest
}

const crud = useAdminCrud<Distributor, DistributorPayload>({
  noun: 'Distribuidor',
  list: () => adminService.distributors(),
  create: (f) => adminService.createDistributor(payload(f)),
  update: (id, f) => adminService.updateDistributor(id, payload(f)),
  remove: (id) => adminService.deleteDistributor(id),
  blank: () => ({ name: '', email: '', phone: '', company: '', ruc: '', city: '', isActive: true, password: '' }),
  toForm: (d) => ({
    name: d.name,
    email: d.email,
    phone: d.phone || '',
    company: d.company || '',
    ruc: d.ruc || '',
    city: d.city || '',
    isActive: d.isActive,
    password: '',
  }),
  validate: (f, editingId) => {
    if (!f.name.trim() || !f.email.trim()) return 'Nombre y correo son obligatorios'
    if (!editingId && (f.password || '').trim().length < 6) return 'La contraseña debe tener al menos 6 caracteres'
    if (f.password && f.password.trim().length > 0 && f.password.trim().length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres'
    }
    return null
  },
})
const { items, loading, saving, sheetOpen, editingId, form, toDelete } = crud

onMounted(crud.load)
</script>

<template>
  <section>
    <AdminPageHeader title="Distribuidores" subtitle="Ven el precio distribuidor al iniciar sesión y pagan por transferencia">
      <button type="button" class="adm-btn adm-btn--primary" @click="crud.openNew">
        <i class="fa-solid fa-plus"></i> Nuevo distribuidor
      </button>
    </AdminPageHeader>

    <p v-if="loading" class="adm-loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</p>
    <p v-else-if="!items.length" class="adm-empty"><i class="fa-solid fa-truck-ramp-box"></i> Aún no hay distribuidores</p>

    <div v-else class="adm-card dist">
      <div class="adm-table">
        <div class="adm-table__head">
          <span class="adm-table__cell--main">Distribuidor</span>
          <span class="col-city">Ciudad</span>
          <span class="col-contact">Contacto</span>
          <span class="col-active">Activo</span>
          <span class="col-tools"></span>
        </div>
        <div v-for="d in items" :key="d._id" class="adm-table__row">
          <div class="adm-table__cell adm-table__cell--main">
            {{ d.company || d.name }}
            <small class="adm-muted dist__sub">{{ d.company ? d.name : '' }}<template v-if="d.ruc"> · RUC {{ d.ruc }}</template></small>
          </div>
          <div class="adm-table__cell col-city" data-label="Ciudad">{{ d.city || '-' }}</div>
          <div class="adm-table__cell col-contact" data-label="Contacto">
            <a :href="`mailto:${d.email}`">{{ d.email }}</a>
            <a v-if="d.phone" :href="`https://wa.me/${waNumber(d.phone)}`" target="_blank" rel="noopener" class="dist__wa">
              <i class="fa-brands fa-whatsapp"></i> {{ d.phone }}
            </a>
          </div>
          <div class="adm-table__cell col-active">
            <AdminSwitch :model-value="d.isActive" :label="d.isActive ? 'Activo' : 'Inactivo'" @update:model-value="(v) => crud.patch(d, { isActive: v })" />
          </div>
          <div class="adm-table__cell col-tools">
            <button type="button" class="adm-btn adm-btn--ghost adm-btn--icon" aria-label="Editar" @click="crud.openEdit(d)">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button type="button" class="adm-btn adm-btn--danger adm-btn--icon" aria-label="Eliminar" @click="toDelete = d">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <AdminSheet
      :open="sheetOpen"
      :title="editingId ? 'Editar distribuidor' : 'Nuevo distribuidor'"
      :saving="saving"
      @close="sheetOpen = false"
      @save="crud.save"
    >
      <AdminDistributorFields v-model="form" :editing="!!editingId" />
    </AdminSheet>

    <BaseModal
      :open="!!toDelete"
      danger
      title="¿Eliminar distribuidor?"
      :message="`${toDelete?.company || toDelete?.name} ya no podrá ingresar. Sus pedidos anteriores se conservan.`"
      confirm-label="Eliminar"
      @confirm="crud.confirmDelete"
      @cancel="toDelete = null"
    />
  </section>
</template>

<style scoped lang="scss">
.dist {
  padding: 0.6rem;

  &__sub {
    display: block;
    font-weight: 400;
  }

  &__wa {
    display: block;
    color: $ink-soft;
  }

  a {
    word-break: break-all;
  }
}

.col-contact {
  flex: 1 1 200px;
  font-size: $text-sm;
}

.col-tools {
  @include flex(row, center, flex-end, 0.4rem);
  margin-left: auto;
}

@include from('lg') {
  .col-city {
    flex: 0 0 130px;
  }

  .col-contact {
    flex: 0 0 240px;
  }

  .col-active {
    flex: 0 0 120px;
  }

  .col-tools {
    flex: 0 0 90px;
  }
}
</style>
