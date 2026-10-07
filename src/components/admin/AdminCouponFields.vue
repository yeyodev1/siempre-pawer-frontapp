<script setup lang="ts">
import type { CouponPayload } from '@/services/admin.service'
import AdminSwitch from './AdminSwitch.vue'

const form = defineModel<CouponPayload>({ required: true })

function onCode(event: Event) {
  form.value.code = (event.target as HTMLInputElement).value.toUpperCase().replace(/[^A-Z0-9]/g, '')
}
</script>

<template>
  <div class="adm-field">
    <label for="cp-code">Código</label>
    <input id="cp-code" :value="form.code" required placeholder="Ej. PW50" autocapitalize="characters" class="code" @input="onCode" />
    <small>Solo letras y números. Link: siemprepawer.com/?ref={{ form.code || 'CODIGO' }}</small>
  </div>
  <div class="adm-field">
    <label for="cp-name">Influencer</label>
    <input id="cp-name" v-model="form.influencerName" required placeholder="Nombre" />
  </div>
  <div class="adm-fields">
    <div class="adm-field">
      <label for="cp-ig">Instagram</label>
      <input id="cp-ig" v-model="form.influencerInstagram" placeholder="@usuario" />
    </div>
    <div class="adm-field">
      <label for="cp-mail">Correo</label>
      <input id="cp-mail" v-model="form.influencerEmail" type="email" placeholder="Opcional" />
    </div>
  </div>
  <div class="adm-fields">
    <div class="adm-field">
      <label for="cp-disc">% descuento al cliente</label>
      <input id="cp-disc" v-model.number="form.discountPct" type="number" min="0" max="90" inputmode="numeric" />
    </div>
    <div class="adm-field">
      <label for="cp-com">% comisión influencer</label>
      <input id="cp-com" v-model.number="form.commissionPct" type="number" min="0" max="90" inputmode="numeric" />
    </div>
  </div>
  <div class="adm-field">
    <label for="cp-notes">Notas</label>
    <textarea id="cp-notes" v-model="form.notes" rows="2" placeholder="Acuerdo, forma de pago de la comisión..."></textarea>
  </div>
  <AdminSwitch v-model="form.isActive" label="Activo" hint="Si lo apagas, el código deja de funcionar" />
</template>

<style scoped lang="scss">
.code {
  font-family: $font-display;
  font-size: 1.4rem;
  letter-spacing: 0.08em;
}
</style>
