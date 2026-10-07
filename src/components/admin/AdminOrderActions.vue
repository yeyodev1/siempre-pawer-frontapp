<script setup lang="ts">
import type { OrderEditForm } from '@/composables/useAdminOrderDetail'
import { statusLabels, statusOrder } from '@/composables/useAdminFormat'

const form = defineModel<OrderEditForm>({ required: true })
defineProps<{ saving: boolean; dirty: boolean; statusChanged: boolean; whatsappUrl: string }>()
const emit = defineEmits<{ save: []; suggest: [] }>()
</script>

<template>
  <article class="adm-card actions">
    <h2 class="adm-card__title">Gestionar <i class="fa-solid fa-pen-to-square"></i></h2>
    <form class="adm-stack" @submit.prevent="emit('save')">
      <div class="adm-field">
        <label for="order-status">Estado</label>
        <select id="order-status" v-model="form.status">
          <option v-for="s in statusOrder" :key="s" :value="s">{{ statusLabels[s] }}</option>
        </select>
        <small v-if="statusChanged" class="actions__warn">
          <i class="fa-solid fa-envelope"></i> Al guardar se enviará un correo al cliente con el nuevo estado.
        </small>
      </div>

      <template v-if="form.status === 'shipped' || form.trackingNumber">
        <div class="adm-field">
          <label for="order-guia">Número de guía Servientrega</label>
          <input id="order-guia" v-model="form.trackingNumber" inputmode="numeric" placeholder="Ej. 1234567890" @blur="emit('suggest')" />
        </div>
        <div class="adm-field">
          <label for="order-url">Link de rastreo</label>
          <input id="order-url" v-model="form.trackingUrl" type="url" placeholder="https://..." />
          <small>Se llena solo al escribir la guía; puedes cambiarlo.</small>
        </div>
      </template>

      <div class="adm-field">
        <label for="order-notes">Notas internas</label>
        <textarea id="order-notes" v-model="form.notes" rows="3" placeholder="Solo las ve el equipo"></textarea>
      </div>

      <button type="submit" class="adm-btn adm-btn--dark" :disabled="saving || !dirty">
        <i :class="saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-check'"></i>
        Guardar cambios
      </button>
      <a :href="whatsappUrl" target="_blank" rel="noopener" class="adm-btn adm-btn--whatsapp">
        <i class="fa-brands fa-whatsapp"></i> Escribir al cliente
      </a>
    </form>
  </article>
</template>

<style scoped lang="scss">
.actions {
  border-color: $ink;

  &__warn {
    color: darken($warning, 16%) !important;
    font-weight: 600;
  }
}
</style>
