<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { copy } from '@/config/copy'

const settings = useSettingsStore()
// Sin anuncio configurado mostramos los slogans: la barra es parte de la marca.
const text = computed(() => settings.settings.announcement.trim())
</script>

<template>
  <div class="bar">
    <p v-if="text" class="bar__text">{{ text }}</p>
    <p v-else class="bar__text bar__text--slogans">
      <span v-for="item in copy.marquee" :key="item">{{ item }}</span>
    </p>
  </div>
</template>

<style scoped lang="scss">
.bar {
  background: $ink;
  color: $paper;
  padding: 0.45rem 1rem;
  text-align: center;

  &__text {
    font-family: $font-condensed;
    font-weight: 600;
    font-size: 0.82rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;

    &--slogans {
      @include flex(row, center, center, 1.2rem);
      overflow: hidden;
      white-space: nowrap;

      span:nth-child(n + 3) {
        display: none;

        @include from('md') {
          display: inline;
        }
      }

      span + span::before {
        content: '';
        display: inline-block;
        width: 0.45rem;
        height: 0.8rem;
        margin-right: 1.2rem;
        background: $accent;
        transform: skewX(-20deg);
        vertical-align: -0.05rem;
      }
    }
  }
}
</style>
