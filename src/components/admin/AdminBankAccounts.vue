<script setup lang="ts">
import type { BankAccount } from '@/types'

const accounts = defineModel<BankAccount[]>({ default: () => [] })

function add() {
  accounts.value = [...accounts.value, { bank: '', type: 'Ahorros', number: '', holder: '', documentId: '' }]
}

function remove(index: number) {
  accounts.value = accounts.value.filter((_, i) => i !== index)
}
</script>

<template>
  <div class="banks">
    <p v-if="!accounts.length" class="adm-muted">Agrega al menos una cuenta para recibir transferencias.</p>
    <fieldset v-for="(acc, i) in accounts" :key="i" class="banks__item">
      <legend class="visually-hidden">Cuenta {{ i + 1 }}</legend>
      <div class="banks__head">
        <strong>Cuenta {{ i + 1 }}</strong>
        <button type="button" class="adm-btn adm-btn--danger adm-btn--sm" @click="remove(i)">
          <i class="fa-solid fa-trash-can"></i> Quitar
        </button>
      </div>
      <div class="adm-fields">
        <div class="adm-field">
          <label :for="`b-bank-${i}`">Banco</label>
          <input :id="`b-bank-${i}`" v-model="acc.bank" placeholder="Ej. Banco Pichincha" />
        </div>
        <div class="adm-field">
          <label :for="`b-type-${i}`">Tipo</label>
          <select :id="`b-type-${i}`" v-model="acc.type">
            <option>Ahorros</option>
            <option>Corriente</option>
          </select>
        </div>
        <div class="adm-field">
          <label :for="`b-num-${i}`">Número de cuenta</label>
          <input :id="`b-num-${i}`" v-model="acc.number" inputmode="numeric" />
        </div>
        <div class="adm-field">
          <label :for="`b-holder-${i}`">Titular</label>
          <input :id="`b-holder-${i}`" v-model="acc.holder" />
        </div>
        <div class="adm-field">
          <label :for="`b-doc-${i}`">Cédula / RUC del titular</label>
          <input :id="`b-doc-${i}`" v-model="acc.documentId" inputmode="numeric" />
        </div>
      </div>
    </fieldset>
    <button type="button" class="adm-btn adm-btn--ghost adm-btn--sm" @click="add">
      <i class="fa-solid fa-plus"></i> Agregar cuenta
    </button>
  </div>
</template>

<style scoped lang="scss">
.banks {
  @include flex(column, stretch, flex-start, 0.9rem);

  > .adm-btn {
    align-self: flex-start;
  }

  &__item {
    border: 1px solid $line;
    border-radius: $radius-sm;
    padding: 0.9rem;
    background: $sand;
  }

  &__head {
    @include flex(row, center, space-between, 0.5rem);
    margin-bottom: 0.7rem;
  }
}
</style>
