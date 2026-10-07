<script setup lang="ts">
import { ref, watch } from 'vue'

// Stock editable en la lista: guarda al salir del campo o con Enter, solo si cambió.
const props = defineProps<{ value: number; label: string }>()
const emit = defineEmits<{ change: [value: number] }>()

const local = ref(props.value)
watch(
  () => props.value,
  (v) => (local.value = v),
)

function commit() {
  const next = Math.max(0, Math.floor(Number(local.value) || 0))
  local.value = next
  if (next !== props.value) emit('change', next)
}

function step(delta: number) {
  local.value = Math.max(0, (Number(local.value) || 0) + delta)
  commit()
}
</script>

<template>
  <div class="stock" :class="{ 'stock--low': local <= 3 }">
    <button type="button" :aria-label="`Restar 1 a ${label}`" @click.stop="step(-1)">
      <i class="fa-solid fa-minus"></i>
    </button>
    <input
      v-model.number="local"
      type="number"
      min="0"
      inputmode="numeric"
      :aria-label="`Stock de ${label}`"
      @click.stop
      @blur="commit"
      @keydown.enter.prevent="($event.target as HTMLInputElement).blur()"
    />
    <button type="button" :aria-label="`Sumar 1 a ${label}`" @click.stop="step(1)">
      <i class="fa-solid fa-plus"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.stock {
  @include flex(row, stretch, flex-start);
  border: 1px solid $line;
  border-radius: $radius-pill;
  overflow: hidden;
  width: 116px;
  background: $surface;

  button {
    flex: 0 0 34px;
    color: $ink-soft;
    font-size: 0.7rem;

    &:hover {
      background: $sand;
    }
  }

  input {
    border: 0;
    border-radius: 0;
    padding: 0.4rem 0;
    text-align: center;
    font-weight: 700;
    min-width: 0;
    -moz-appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }

    &:focus {
      box-shadow: none;
    }
  }

  &--low input {
    color: $danger;
  }
}
</style>
