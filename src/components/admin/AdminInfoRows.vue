<script setup lang="ts">
import { useAdminCopy } from '@/composables/useAdminCopy'
import type { InfoRow } from './adminTypes'

defineProps<{ rows: InfoRow[] }>()
const { copy } = useAdminCopy()
</script>

<template>
  <dl class="info">
    <template v-for="row in rows" :key="row.label">
      <div v-if="row.value" class="info__row">
        <dt>{{ row.label }}</dt>
        <dd>
          <a v-if="row.href" :href="row.href" target="_blank" rel="noopener">{{ row.value }}</a>
          <span v-else>{{ row.value }}</span>
          <button
            v-if="row.copy"
            type="button"
            class="info__copy"
            :aria-label="`Copiar ${row.label}`"
            @click="copy(String(row.value), `${row.label} copiado`)"
          >
            <i class="fa-regular fa-copy"></i>
          </button>
        </dd>
      </div>
    </template>
  </dl>
</template>

<style scoped lang="scss">
.info {
  @include flex(column, stretch, flex-start, 0.55rem);

  &__row {
    @include flex(column, stretch, flex-start, 0.05rem);

    @include from('sm') {
      flex-direction: row;
      gap: 0.8rem;
    }
  }

  dt {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $ink-muted;

    @include from('sm') {
      flex: 0 0 120px;
      padding-top: 0.15rem;
    }
  }

  dd {
    @include flex(row, flex-start, flex-start, 0.4rem);
    flex: 1;
    min-width: 0;
    word-break: break-word;
    font-size: 0.92rem;

    a {
      text-decoration: underline;
    }
  }

  &__copy {
    color: $ink-muted;
    padding: 0 0.3rem;
    @include focus-ring;

    &:hover {
      color: $ink;
    }
  }
}
</style>
