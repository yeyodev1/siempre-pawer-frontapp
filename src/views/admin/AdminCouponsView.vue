<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { adminService, type CouponPayload } from '@/services/admin.service'
import { useAdminCrud } from '@/composables/useAdminCrud'
import { cents } from '@/composables/useAdminFormat'
import type { Coupon } from '@/types'
import BaseModal from '@/components/ui/BaseModal.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminSheet from '@/components/admin/AdminSheet.vue'
import AdminCouponCard from '@/components/admin/AdminCouponCard.vue'
import AdminCouponFields from '@/components/admin/AdminCouponFields.vue'

const crud = useAdminCrud<Coupon, CouponPayload>({
  noun: 'Cupón',
  list: () => adminService.coupons(),
  create: (f) => adminService.createCoupon(f),
  update: (id, f) => adminService.updateCoupon(id, f),
  remove: (id) => adminService.deleteCoupon(id),
  blank: () => ({
    code: '',
    influencerName: '',
    influencerEmail: '',
    influencerInstagram: '',
    discountPct: 10,
    commissionPct: 10,
    isActive: true,
    notes: '',
  }),
  toForm: (c) => ({
    code: c.code,
    influencerName: c.influencerName,
    influencerEmail: c.influencerEmail || '',
    influencerInstagram: c.influencerInstagram || '',
    discountPct: c.discountPct,
    commissionPct: c.commissionPct,
    isActive: c.isActive,
    notes: c.notes || '',
  }),
  validate: (f) => {
    if (!f.code.trim()) return 'Escribe el código'
    if (!f.influencerName.trim()) return 'Escribe el nombre del influencer'
    if (f.discountPct < 0 || f.discountPct > 90) return 'El descuento debe estar entre 0 y 90%'
    return null
  },
})
const { items, loading, saving, sheetOpen, editingId, form, toDelete } = crud

const totals = computed(() =>
  items.value.reduce(
    (acc, c) => ({
      uses: acc.uses + (c.uses || 0),
      sales: acc.sales + (c.salesTotal || 0),
      commission: acc.commission + (c.commissionTotal || 0),
    }),
    { uses: 0, sales: 0, commission: 0 },
  ),
)

onMounted(crud.load)
</script>

<template>
  <section>
    <AdminPageHeader title="Cupones e influencers" subtitle="Cada influencer con su código, su link y su comisión">
      <button type="button" class="adm-btn adm-btn--primary" @click="crud.openNew">
        <i class="fa-solid fa-plus"></i> Nuevo cupón
      </button>
    </AdminPageHeader>

    <div v-if="items.length" class="summary adm-card">
      <div><span>Usos</span><strong>{{ totals.uses }}</strong></div>
      <div><span>Ventas con cupón</span><strong>{{ cents(totals.sales) }}</strong></div>
      <div><span>Comisiones</span><strong>{{ cents(totals.commission) }}</strong></div>
    </div>

    <p v-if="loading" class="adm-loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</p>
    <p v-else-if="!items.length" class="adm-empty"><i class="fa-solid fa-ticket"></i> Aún no hay cupones</p>

    <div v-else class="coupons">
      <AdminCouponCard
        v-for="c in items"
        :key="c._id"
        :coupon="c"
        @edit="crud.openEdit(c)"
        @remove="toDelete = c"
        @toggle="(v) => crud.patch(c, { isActive: v })"
      />
    </div>

    <AdminSheet
      :open="sheetOpen"
      :title="editingId ? 'Editar cupón' : 'Nuevo cupón'"
      :saving="saving"
      @close="sheetOpen = false"
      @save="crud.save"
    >
      <AdminCouponFields v-model="form" />
    </AdminSheet>

    <BaseModal
      :open="!!toDelete"
      danger
      title="¿Eliminar cupón?"
      :message="`El código ${toDelete?.code} dejará de funcionar y se pierden sus métricas. Si solo quieres pausarlo, desactívalo.`"
      confirm-label="Eliminar"
      @confirm="crud.confirmDelete"
      @cancel="toDelete = null"
    />
  </section>
</template>

<style scoped lang="scss">
.summary {
  @include flex(row, stretch, flex-start, 0.5rem);
  margin-bottom: 1rem;
  background: $night;
  border-color: $night;

  div {
    flex: 1;
    min-width: 0;
    @include flex(column, flex-start, flex-start, 0.1rem);
  }

  span {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba($surface, 0.55);
  }

  strong {
    font-family: $font-display;
    font-weight: 400;
    font-size: 1.6rem;
    color: $accent;
    line-height: 1.1;
  }
}

.coupons {
  @include flex-cards(300px, 0.9rem);
}
</style>
