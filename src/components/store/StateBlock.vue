<script setup lang="ts">
import { copy } from '@/config/copy'

defineProps<{
  state: 'loading' | 'error' | 'empty'
  message?: string
  dark?: boolean
}>()

const emit = defineEmits<{ retry: [] }>()

const icons = {
  loading: 'fa-solid fa-spinner fa-spin',
  error: 'fa-solid fa-plug-circle-exclamation',
  empty: 'fa-solid fa-futbol',
}
</script>

<template>
  <div class="state" :class="[`state--${state}`, { 'state--dark': dark }]" role="status">
    <i :class="icons[state]" class="state__icon"></i>
    <p class="state__text">
      {{ message || (state === 'loading' ? copy.states.loading : state === 'error' ? copy.states.error : '') }}
    </p>
    <button v-if="state === 'error'" class="btn btn--dark btn--sport" type="button" @click="emit('retry')">
      <i class="fa-solid fa-rotate-right"></i> {{ copy.states.retry }}
    </button>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.state {
  @include flex(column, center, center, 0.9rem);
  text-align: center;
  padding: 3.5rem 1rem;
  color: $ink-soft;

  &__icon {
    font-size: 1.8rem;
    color: $accent-deep;
  }

  &__text {
    max-width: 40ch;
    font-size: $text-sm;
  }

  &--dark {
    color: rgba($paper, 0.75);
  }
}
</style>
