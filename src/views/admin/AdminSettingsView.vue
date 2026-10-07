<script setup lang="ts">
import { onMounted } from 'vue'
import { useAdminSettings } from '@/composables/useAdminSettings'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminMoneyInput from '@/components/admin/AdminMoneyInput.vue'
import AdminSwitch from '@/components/admin/AdminSwitch.vue'
import AdminBankAccounts from '@/components/admin/AdminBankAccounts.vue'

const { form, loading, saving, load, save } = useAdminSettings()

onMounted(load)
</script>

<template>
  <section>
    <AdminPageHeader title="Ajustes" subtitle="Envíos, pagos y datos de contacto de la tienda" />

    <p v-if="loading" class="adm-loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</p>

    <form v-else class="settings adm-stack" @submit.prevent="save">
      <article class="adm-card">
        <h2 class="adm-card__title">Envíos <i class="fa-solid fa-truck-fast"></i></h2>
        <div class="adm-fields">
          <AdminMoneyInput id="s-ship" v-model="form.shippingCost" label="Costo de envío" hint="Servientrega a todo Ecuador" />
          <AdminMoneyInput
            id="s-free"
            v-model="form.freeShippingFrom"
            label="Envío gratis desde"
            hint="Subtotal mínimo. 0 = nunca gratis"
          />
        </div>
        <div class="adm-field settings__gap">
          <label for="s-pickup">Dirección de retiro</label>
          <textarea id="s-pickup" v-model="form.pickupAddress" rows="2" placeholder="Urdesa, Guayaquil..."></textarea>
        </div>
      </article>

      <article class="adm-card adm-stack">
        <h2 class="adm-card__title">Métodos de pago <i class="fa-solid fa-wallet"></i></h2>
        <div class="payphone" :class="{ 'payphone--on': form.payphoneEnabled }">
          <i class="fa-solid fa-credit-card"></i>
          <div>
            <strong>Payphone (tarjeta)</strong>
            <p>{{ form.payphoneEnabled ? 'Conectado' : 'Pendiente de credenciales' }}</p>
          </div>
          <span class="payphone__dot"></span>
        </div>
        <AdminSwitch v-model="form.transferEnabled" label="Transferencia bancaria" hint="El pedido espera a que confirmes el pago" />
        <AdminSwitch v-model="form.codEnabled" label="Contra entrega" hint="Se paga al recibir" />
      </article>

      <article v-if="form.transferEnabled" class="adm-card">
        <h2 class="adm-card__title">Cuentas bancarias <i class="fa-solid fa-building-columns"></i></h2>
        <AdminBankAccounts v-model="form.bankAccounts" />
      </article>

      <article class="adm-card adm-stack">
        <h2 class="adm-card__title">Contacto y anuncio <i class="fa-solid fa-bullhorn"></i></h2>
        <div class="adm-field">
          <label for="s-wa">WhatsApp de la tienda</label>
          <input id="s-wa" v-model="form.whatsapp" type="tel" inputmode="tel" placeholder="593991234567" />
          <small>Con código de país, sin + ni espacios.</small>
        </div>
        <div class="adm-field">
          <label for="s-ann">Anuncio de la barra superior</label>
          <input id="s-ann" v-model="form.announcement" maxlength="140" placeholder="Ej. Envío gratis desde $60 a todo Ecuador" />
          <small>Déjalo vacío para ocultar la barra.</small>
        </div>
      </article>

      <div class="settings__bar">
        <button type="submit" class="adm-btn adm-btn--primary settings__save" :disabled="saving">
          <i :class="saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-check'"></i>
          Guardar ajustes
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped lang="scss">
.settings {
  max-width: 760px;

  &__gap {
    margin-top: 0.9rem;
  }

  &__bar {
    position: sticky;
    bottom: calc(70px + env(safe-area-inset-bottom));

    @include from('lg') {
      bottom: 1rem;
    }
  }

  &__save {
    width: 100%;
    box-shadow: $shadow-md;

    @include from('md') {
      width: auto;
    }
  }
}

.payphone {
  @include flex(row, center, flex-start, 0.8rem);
  padding: 0.8rem 1rem;
  border-radius: $radius-sm;
  background: $warning-bg;

  > i {
    font-size: 1.2rem;
    color: $ink-soft;
  }

  div {
    flex: 1;
  }

  p {
    font-size: $text-sm;
    color: darken($warning, 16%);
    font-weight: 600;
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: $warning;
  }

  &--on {
    background: $success-bg;

    p {
      color: darken($success, 12%);
    }

    .payphone__dot {
      background: $success;
    }
  }
}
</style>
