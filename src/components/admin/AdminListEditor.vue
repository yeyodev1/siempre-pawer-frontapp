<script setup lang="ts">
import { nextTick, ref } from 'vue'

const items = defineModel<string[]>({ default: () => [] })
defineProps<{ placeholder?: string; addLabel?: string; label: string }>()

const list = ref<HTMLElement | null>(null)

async function add() {
  items.value = [...items.value, '']
  await nextTick()
  const inputs = list.value?.querySelectorAll('input')
  inputs?.[inputs.length - 1]?.focus()
}

function remove(index: number) {
  items.value = items.value.filter((_, i) => i !== index)
}

function update(index: number, value: string) {
  items.value = items.value.map((item, i) => (i === index ? value : item))
}
</script>

<template>
  <div class="list-editor">
    <span class="list-editor__label">{{ label }}</span>
    <ul ref="list" class="list-editor__items">
      <li v-for="(item, i) in items" :key="i" class="list-editor__row">
        <i class="fa-solid fa-check list-editor__bullet"></i>
        <input
          :value="item"
          :placeholder="placeholder"
          :aria-label="`${label} ${i + 1}`"
          @input="update(i, ($event.target as HTMLInputElement).value)"
          @keydown.enter.prevent="add"
        />
        <button type="button" class="adm-btn adm-btn--ghost adm-btn--icon" aria-label="Quitar" @click="remove(i)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </li>
    </ul>
    <button type="button" class="adm-btn adm-btn--ghost adm-btn--sm" @click="add">
      <i class="fa-solid fa-plus"></i> {{ addLabel || 'Agregar' }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.list-editor {
  &__label {
    display: block;
    font-size: 0.82rem;
    font-weight: 600;
    color: $ink-soft;
    margin-bottom: 0.35rem;
  }

  &__items {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.45rem);
    margin-bottom: 0.6rem;

    &:empty {
      display: none;
    }
  }

  &__row {
    @include flex(row, center, flex-start, 0.5rem);
  }

  &__bullet {
    color: $accent-deep;
    font-size: 0.8rem;
  }
}
</style>
