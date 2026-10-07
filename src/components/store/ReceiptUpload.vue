<script setup lang="ts">
import { ref } from 'vue'
import { copy } from '@/config/copy'

defineProps<{ uploading: boolean; currentUrl?: string }>()
const emit = defineEmits<{ upload: [file: File] }>()

const file = ref<File | null>(null)
const t = copy.order

function pick(event: Event) {
  file.value = (event.target as HTMLInputElement).files?.[0] || null
}
</script>

<template>
  <form class="receipt" @submit.prevent="file && emit('upload', file)">
    <p class="receipt__hint">{{ t.receiptHint }}</p>
    <label class="receipt__pick">
      <input type="file" accept="image/*,application/pdf" class="visually-hidden" @change="pick" />
      <i class="fa-solid fa-paperclip"></i>
      <span>{{ file ? file.name : t.receiptPick }}</span>
    </label>
    <button type="submit" class="btn btn--primary btn--sport btn--block" :disabled="!file || uploading">
      <i :class="uploading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-upload'"></i>
      {{ t.receiptSend }}
    </button>
    <a v-if="currentUrl" :href="currentUrl" target="_blank" rel="noopener" class="receipt__current">
      <i class="fa-solid fa-file-circle-check"></i> {{ t.receiptView }}
    </a>
  </form>
</template>

<style scoped lang="scss">
.receipt {
  @include flex(column, stretch, flex-start, 0.7rem);

  &__hint {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__pick {
    @include flex(row, center, flex-start, 0.6rem);
    margin: 0;
    border: 1.5px dashed $ink-muted;
    padding: 0.9rem 1rem;
    cursor: pointer;
    color: $ink;
    font-size: 0.95rem;
    background: $paper;

    &:focus-within {
      outline: 2px solid $accent;
    }

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__current {
    font-size: $text-sm;
    color: $success;
    font-weight: 600;
  }
}
</style>
