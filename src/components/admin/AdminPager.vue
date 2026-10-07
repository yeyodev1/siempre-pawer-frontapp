<script setup lang="ts">
defineProps<{ page: number; pages: number }>()
const emit = defineEmits<{ go: [page: number] }>()
</script>

<template>
  <nav v-if="pages > 1" class="pager" aria-label="Paginación">
    <button type="button" class="adm-btn adm-btn--ghost adm-btn--sm" :disabled="page <= 1" @click="emit('go', page - 1)">
      <i class="fa-solid fa-chevron-left"></i> Anterior
    </button>
    <span class="pager__info">Página {{ page }} de {{ pages }}</span>
    <button type="button" class="adm-btn adm-btn--ghost adm-btn--sm" :disabled="page >= pages" @click="emit('go', page + 1)">
      Siguiente <i class="fa-solid fa-chevron-right"></i>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.pager {
  @include flex(row, center, center, 0.8rem);
  margin-top: 1.2rem;

  &__info {
    font-size: $text-sm;
    color: $ink-muted;
  }
}
</style>
