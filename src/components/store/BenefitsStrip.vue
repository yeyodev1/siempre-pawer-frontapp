<script setup lang="ts">
import { computed } from 'vue'
import { site } from '@/config/site'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()

// Sin credenciales de Payphone no se promete el pago con tarjeta.
const benefits = computed(() =>
  site.benefits.map((b) =>
    b.title.includes('PayPhone') && !settings.settings.payphoneEnabled
      ? { ...b, title: 'Paga como prefieras', text: 'Transferencia o contra entrega.' }
      : b,
  ),
)
</script>

<template>
  <section class="benefits">
    <div class="benefits__inner">
      <component
        :is="'to' in b && b.to ? 'RouterLink' : 'article'"
        v-for="b in benefits"
        :key="b.title"
        :to="'to' in b ? b.to : undefined"
        class="benefit"
      >
        <i :class="b.icon" class="benefit__icon"></i>
        <div>
          <h3 class="benefit__title">{{ b.title }}</h3>
          <p class="benefit__text">{{ b.text }}</p>
        </div>
      </component>
    </div>
  </section>
</template>

<style scoped lang="scss">
.benefits {
  border-top: 1px solid $line;

  &__inner {
    @include container(1280px);
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem 0.75rem;
    padding-block: 1.8rem;
  }
}

// 4 en fila en el celular, solo icono y título, como los accesos de la referencia.
.benefit {
  flex: 1 1 0;
  min-width: 0;
  @include flex(column, center, flex-start, 0.5rem);
  text-align: center;
  color: $ink;

  @include from('md') {
    flex-direction: row;
    align-items: flex-start;
    text-align: left;
    gap: 0.9rem;
  }

  &__icon {
    font-size: 1.2rem;
    color: $ink;
    width: 2.8rem;
    height: 2.8rem;
    flex-shrink: 0;
    border-radius: 50%;
    background: $accent;
    @include flex(row, center, center);
  }

  &__title {
    font-family: $font-condensed;
    font-weight: 700;
    font-size: 0.85rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    line-height: 1.15;

    @include from('md') {
      font-size: 1.05rem;
    }
  }

  &__text {
    display: none;
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.45;

    @include from('md') {
      display: block;
    }
  }
}
</style>
