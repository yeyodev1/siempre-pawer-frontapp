<script setup lang="ts">
import { ref } from 'vue'
import type { DistributorPayload } from '@/services/admin.service'
import AdminSwitch from './AdminSwitch.vue'

const form = defineModel<DistributorPayload>({ required: true })
defineProps<{ editing: boolean }>()

const showPassword = ref(false)

// Contraseña fácil de dictar por WhatsApp: sin caracteres que se confundan.
function generate() {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'
  form.value.password = Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  showPassword.value = true
}
</script>

<template>
  <div class="adm-field">
    <label for="d-name">Nombre de contacto</label>
    <input id="d-name" v-model="form.name" required autocomplete="off" />
  </div>
  <div class="adm-fields">
    <div class="adm-field">
      <label for="d-company">Empresa</label>
      <input id="d-company" v-model="form.company" />
    </div>
    <div class="adm-field">
      <label for="d-ruc">RUC</label>
      <input id="d-ruc" v-model="form.ruc" inputmode="numeric" maxlength="13" />
    </div>
  </div>
  <div class="adm-fields">
    <div class="adm-field">
      <label for="d-city">Ciudad</label>
      <input id="d-city" v-model="form.city" />
    </div>
    <div class="adm-field">
      <label for="d-phone">Teléfono</label>
      <input id="d-phone" v-model="form.phone" type="tel" inputmode="tel" />
    </div>
  </div>
  <div class="adm-field">
    <label for="d-email">Correo (usuario para ingresar)</label>
    <input id="d-email" v-model="form.email" type="email" required autocomplete="off" />
  </div>
  <div class="adm-field">
    <label for="d-pass">{{ editing ? 'Nueva contraseña' : 'Contraseña' }}</label>
    <div class="pass">
      <input
        id="d-pass"
        v-model="form.password"
        :type="showPassword ? 'text' : 'password'"
        :required="!editing"
        minlength="6"
        autocomplete="new-password"
        :placeholder="editing ? 'Déjala vacía para no cambiarla' : 'Mínimo 6 caracteres'"
      />
      <button type="button" class="adm-btn adm-btn--ghost adm-btn--icon" :aria-label="showPassword ? 'Ocultar' : 'Mostrar'" @click="showPassword = !showPassword">
        <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
      </button>
      <button type="button" class="adm-btn adm-btn--ghost adm-btn--sm" @click="generate">Generar</button>
    </div>
    <small>Envíasela al distribuidor; no se vuelve a mostrar.</small>
  </div>
  <AdminSwitch v-model="form.isActive" label="Activo" hint="Si lo apagas, no puede iniciar sesión" />
</template>

<style scoped lang="scss">
.pass {
  @include flex(row, center, flex-start, 0.4rem);

  input {
    flex: 1;
    min-width: 0;
  }
}
</style>
