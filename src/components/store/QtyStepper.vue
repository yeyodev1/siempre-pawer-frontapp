<script setup lang="ts">
const props = withDefaults(defineProps<{ modelValue: number; max?: number; small?: boolean }>(), {
  max: 999,
  small: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

function set(value: number) {
  const max = props.max > 0 ? props.max : 1
  emit('update:modelValue', Math.max(1, Math.min(Math.round(value) || 1, max)))
}
</script>

<template>
  <div class="qty" :class="{ 'qty--small': small }">
    <button type="button" class="qty__btn" aria-label="Quitar una unidad" :disabled="modelValue <= 1" @click="set(modelValue - 1)">
      <i class="fa-solid fa-minus"></i>
    </button>
    <input
      class="qty__input"
      type="number"
      inputmode="numeric"
      min="1"
      :max="max"
      :value="modelValue"
      aria-label="Cantidad"
      @change="set(Number(($event.target as HTMLInputElement).value))"
    />
    <button type="button" class="qty__btn" aria-label="Agregar una unidad" :disabled="modelValue >= max" @click="set(modelValue + 1)">
      <i class="fa-solid fa-plus"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.qty {
  @include flex(row, stretch);
  border: 1.5px solid $ink;
  border-radius: 4px;
  height: 3.1rem;
  width: fit-content;

  &__btn {
    width: 2.9rem;
    @include flex(row, center, center);
    font-size: 0.8rem;
    @include transition(background);

    &:hover:not(:disabled) {
      background: $accent;
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  &__input {
    width: 3.2rem;
    border: none;
    border-radius: 0;
    text-align: center;
    font-family: $font-condensed;
    font-weight: 700;
    font-size: 1.15rem;
    padding: 0;
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }

    &:focus {
      box-shadow: none;
      background: $accent-soft;
    }
  }

  &--small {
    height: 2.4rem;
    border-width: 1px;

    .qty__btn {
      width: 2.2rem;
    }

    .qty__input {
      width: 2.4rem;
      font-size: 1rem;
    }
  }
}
</style>
