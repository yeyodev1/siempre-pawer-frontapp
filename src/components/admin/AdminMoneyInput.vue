<script setup lang="ts">
import { ref, watch } from 'vue'
import { centsToDollars, dollarsToCents } from '@/composables/useAdminFormat'

// El dueño escribe dólares ("25,50"); el modelo siempre guarda centavos.
const model = defineModel<number | undefined>()
const props = defineProps<{ label: string; hint?: string; optional?: boolean; id: string }>()

const text = ref(centsToDollars(model.value))

watch(model, (value) => {
  if (dollarsToCents(text.value) !== value) text.value = centsToDollars(value)
})

function onInput() {
  if (props.optional && text.value.trim() === '') {
    model.value = undefined
    return
  }
  model.value = dollarsToCents(text.value)
}
</script>

<template>
  <div class="adm-field money">
    <label :for="id">{{ label }}</label>
    <div class="money__box">
      <span class="money__sign">$</span>
      <input
        :id="id"
        v-model="text"
        inputmode="decimal"
        :placeholder="optional ? 'Opcional' : '0.00'"
        @input="onInput"
        @blur="text = text.trim() ? centsToDollars(model) : ''"
      />
    </div>
    <small v-if="hint">{{ hint }}</small>
  </div>
</template>

<style scoped lang="scss">
.money {
  &__box {
    position: relative;
  }

  &__sign {
    position: absolute;
    left: 0.85rem;
    top: 50%;
    transform: translateY(-50%);
    color: $ink-muted;
    font-weight: 600;
    pointer-events: none;
  }

  input {
    padding-left: 1.7rem;
    font-variant-numeric: tabular-nums;
  }
}
</style>
