<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminOrderDetail } from '@/composables/useAdminOrderDetail'
import { when, statusLabels } from '@/composables/useAdminFormat'
import BaseModal from '@/components/ui/BaseModal.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminStatusChip from '@/components/admin/AdminStatusChip.vue'
import AdminOrderPeople from '@/components/admin/AdminOrderPeople.vue'
import AdminOrderItems from '@/components/admin/AdminOrderItems.vue'
import AdminOrderActions from '@/components/admin/AdminOrderActions.vue'
import AdminOrderHistory from '@/components/admin/AdminOrderHistory.vue'

const route = useRoute()
const {
  order,
  loading,
  saving,
  confirmOpen,
  form,
  statusChanged,
  dirty,
  load,
  requestSave,
  save,
  suggestTrackingUrl,
  whatsappUrl,
} = useAdminOrderDetail(String(route.params.id))

onMounted(load)
</script>

<template>
  <section>
    <p v-if="loading" class="adm-loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando pedido...</p>

    <template v-else-if="order">
      <AdminPageHeader :title="`Pedido ${order.number}`" :subtitle="`Creado el ${when(order.createdAt)}`" back="/admin/pedidos">
        <AdminStatusChip :status="order.status" class="detail__status" />
        <span v-if="order.isDistributor" class="adm-chip adm-chip--gold">Distribuidor</span>
      </AdminPageHeader>

      <div class="detail">
        <div class="detail__main adm-stack">
          <AdminOrderItems :order="order" />
          <AdminOrderPeople :order="order" />
        </div>
        <div class="detail__side adm-stack">
          <AdminOrderActions
            v-model="form"
            :saving="saving"
            :dirty="dirty"
            :status-changed="statusChanged"
            :whatsapp-url="whatsappUrl"
            :locked="order.status === 'cancelled'"
            @save="requestSave"
            @suggest="suggestTrackingUrl"
          />
          <AdminOrderHistory :history="order.history || []" />
        </div>
      </div>
    </template>

    <p v-else class="adm-empty"><i class="fa-solid fa-circle-question"></i> No encontramos este pedido</p>

    <BaseModal
      :open="confirmOpen"
      title="¿Cambiar el estado?"
      :message="`El pedido pasará a «${statusLabels[form.status]}» y el cliente recibirá un correo avisándole.`"
      confirm-label="Sí, guardar y avisar"
      @confirm="save"
      @cancel="confirmOpen = false"
    />
  </section>
</template>

<style scoped lang="scss">
.detail {
  @include flex(column, stretch, flex-start, 1rem);

  // En el celular lo primero es gestionar: las acciones suben arriba.
  &__side {
    order: -1;
  }

  @include from('lg') {
    flex-direction: row;
    align-items: flex-start;

    &__main {
      flex: 1 1 auto;
      min-width: 0;
    }

    &__side {
      order: 0;
      flex: 0 0 340px;
      position: sticky;
      top: 1.5rem;
    }
  }

  &__status {
    font-size: 0.85rem;
  }
}
</style>
