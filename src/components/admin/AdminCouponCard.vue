<script setup lang="ts">
import type { Coupon } from '@/types'
import { cents } from '@/composables/useAdminFormat'
import { useAdminCopy } from '@/composables/useAdminCopy'
import AdminSwitch from './AdminSwitch.vue'

const props = defineProps<{ coupon: Coupon }>()
const emit = defineEmits<{ edit: []; remove: []; toggle: [value: boolean] }>()
const { copy } = useAdminCopy()

function copyLink() {
  copy(`https://siemprepawer.com/?ref=${props.coupon.code}`, 'Link copiado, pásaselo al influencer')
}
</script>

<template>
  <article class="coupon adm-card" :class="{ 'coupon--off': !coupon.isActive }">
    <header class="coupon__head">
      <div>
        <span class="coupon__code">{{ coupon.code }}</span>
        <p class="coupon__who">
          {{ coupon.influencerName }}
          <a
            v-if="coupon.influencerInstagram"
            :href="`https://instagram.com/${coupon.influencerInstagram.replace('@', '')}`"
            target="_blank"
            rel="noopener"
            class="coupon__ig"
          >
            <i class="fa-brands fa-instagram"></i> {{ coupon.influencerInstagram }}
          </a>
        </p>
      </div>
      <span class="coupon__pct">-{{ coupon.discountPct }}%</span>
    </header>

    <dl class="coupon__metrics">
      <div><dt>Usos</dt><dd>{{ coupon.uses || 0 }}</dd></div>
      <div><dt>Ventas</dt><dd>{{ cents(coupon.salesTotal) }}</dd></div>
      <div>
        <dt>Comisión {{ coupon.commissionPct }}%</dt>
        <dd class="coupon__commission">{{ cents(coupon.commissionTotal) }}</dd>
      </div>
    </dl>

    <footer class="coupon__foot">
      <AdminSwitch :model-value="coupon.isActive" label="Activo" @update:model-value="(v) => emit('toggle', v)" />
      <div class="coupon__tools">
        <button type="button" class="adm-btn adm-btn--dark adm-btn--sm" @click="copyLink">
          <i class="fa-solid fa-link"></i> Copiar link
        </button>
        <button type="button" class="adm-btn adm-btn--ghost adm-btn--icon" aria-label="Editar" @click="emit('edit')">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button type="button" class="adm-btn adm-btn--danger adm-btn--icon" aria-label="Eliminar" @click="emit('remove')">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </footer>
  </article>
</template>

<style scoped lang="scss">
.coupon {
  @include flex(column, stretch, flex-start, 0.9rem);

  &--off {
    opacity: 0.65;
  }

  &__head {
    @include flex(row, flex-start, space-between, 0.6rem);
  }

  &__code {
    font-family: $font-display;
    font-size: 1.9rem;
    letter-spacing: 0.06em;
    line-height: 1;
    background: $ink;
    color: $accent;
    padding: 0.25rem 0.6rem 0.1rem;
    border-radius: 6px;
  }

  &__who {
    margin-top: 0.5rem;
    font-weight: 600;
    @include flex(row, center, flex-start, 0.3rem 0.6rem);
    flex-wrap: wrap;
  }

  &__ig {
    font-weight: 500;
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__pct {
    font-family: $font-display;
    font-size: 1.7rem;
    color: $success;
  }

  &__metrics {
    @include flex(row, stretch, flex-start, 0.5rem);
    background: $sand;
    border-radius: 8px;
    padding: 0.6rem 0.75rem;

    div {
      flex: 1;
      min-width: 0;
    }

    dt {
      font-size: 0.66rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: $ink-muted;
    }

    dd {
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
  }

  &__commission {
    color: darken($accent-deep, 8%);
  }

  &__foot {
    @include flex(row, center, space-between, 0.6rem);
    flex-wrap: wrap;
  }

  &__tools {
    @include flex(row, center, flex-end, 0.4rem);
  }
}
</style>
