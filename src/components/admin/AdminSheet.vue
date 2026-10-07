<script setup lang="ts">
import { toRef } from 'vue'
import { useBodyScroll } from '@/composables/useBodyScroll'

const props = defineProps<{
  open: boolean
  title: string
  saving?: boolean
  saveLabel?: string
}>()

const emit = defineEmits<{ close: []; save: [] }>()

useBodyScroll(toRef(props, 'open'))
</script>

<template>
  <Teleport to="body">
    <!-- Va fuera del layout: la clase adm le da acceso a los estilos del panel. -->
    <Transition name="sheet">
      <div v-if="open" class="adm sheet" @click.self="emit('close')" @keydown.esc="emit('close')">
        <form class="sheet__panel" role="dialog" aria-modal="true" :aria-label="title" @submit.prevent="emit('save')">
          <header class="sheet__head">
            <h2 class="sheet__title">{{ title }}</h2>
            <button type="button" class="adm-btn adm-btn--ghost adm-btn--icon" aria-label="Cerrar" @click="emit('close')">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </header>
          <div class="sheet__body adm-stack">
            <slot />
          </div>
          <footer class="sheet__foot">
            <button type="button" class="adm-btn adm-btn--ghost" @click="emit('close')">Cancelar</button>
            <button type="submit" class="adm-btn adm-btn--dark" :disabled="saving">
              <i :class="saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-check'"></i>
              {{ saveLabel || 'Guardar' }}
            </button>
          </footer>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.sheet {
  position: fixed;
  inset: 0;
  z-index: 150;
  background: $overlay;
  @include flex(column, stretch, flex-end);

  @include from('md') {
    flex-direction: row;
    justify-content: flex-end;
  }

  &__panel {
    background: $paper;
    max-height: 92vh;
    border-radius: $radius-md $radius-md 0 0;
    @include flex(column, stretch, flex-start);

    @include from('md') {
      width: 480px;
      max-height: none;
      height: 100%;
      border-radius: 0;
    }
  }

  &__head {
    @include flex(row, center, space-between, 0.5rem);
    padding: 1rem 1.25rem;
    border-bottom: 1px solid $line;
  }

  &__title {
    font-family: $font-display;
    font-size: $text-xl;
    letter-spacing: 0.03em;
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 1.25rem;
  }

  &__foot {
    @include flex(row, center, flex-end, 0.5rem);
    padding: 0.9rem 1.25rem calc(0.9rem + env(safe-area-inset-bottom));
    border-top: 1px solid $line;
  }
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;

  .sheet__panel {
    transition: transform 0.3s $ease;
  }
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;

  .sheet__panel {
    transform: translateY(30px);

    @include from('md') {
      transform: translateX(40px);
    }
  }
}
</style>
