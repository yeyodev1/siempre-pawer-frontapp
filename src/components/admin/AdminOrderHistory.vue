<script setup lang="ts">
import type { OrderHistoryEntry } from '@/types'
import { when } from '@/composables/useAdminFormat'
import AdminStatusChip from './AdminStatusChip.vue'

defineProps<{ history: OrderHistoryEntry[] }>()
</script>

<template>
  <article class="adm-card">
    <h2 class="adm-card__title">Historial <i class="fa-solid fa-clock-rotate-left"></i></h2>
    <ol v-if="history.length" class="history">
      <li v-for="(entry, i) in [...history].reverse()" :key="i" class="history__item">
        <div class="history__top">
          <AdminStatusChip :status="entry.status" />
          <span class="adm-muted">{{ when(entry.at) }}</span>
        </div>
        <p v-if="entry.note" class="history__note">{{ entry.note }}</p>
      </li>
    </ol>
    <p v-else class="adm-muted">Sin movimientos</p>
  </article>
</template>

<style scoped lang="scss">
.history {
  list-style: none;
  @include flex(column, stretch, flex-start, 0.9rem);
  border-left: 2px solid $line;
  padding-left: 1rem;

  &__item {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: calc(-1rem - 6px);
      top: 0.45rem;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: $surface;
      border: 2px solid $ink;
    }
  }

  &__top {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
  }

  &__note {
    font-size: $text-sm;
    color: $ink-soft;
    margin-top: 0.25rem;
  }
}
</style>
