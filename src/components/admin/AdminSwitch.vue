<script setup lang="ts">
const model = defineModel<boolean>({ default: false })
defineProps<{ label?: string; hint?: string }>()
</script>

<template>
  <label class="switch" :class="{ 'switch--on': model }">
    <input v-model="model" type="checkbox" class="visually-hidden" />
    <span class="switch__track" aria-hidden="true"><span class="switch__knob"></span></span>
    <span v-if="label || hint" class="switch__text">
      <span v-if="label" class="switch__label">{{ label }}</span>
      <small v-if="hint" class="switch__hint">{{ hint }}</small>
    </span>
  </label>
</template>

<style scoped lang="scss">
.switch {
  @include flex(row, center, flex-start, 0.6rem);
  margin: 0;
  cursor: pointer;
  color: $ink;
  user-select: none;

  &__track {
    position: relative;
    width: 40px;
    height: 23px;
    flex: 0 0 40px;
    border-radius: $radius-pill;
    background: $line;
    @include transition(background);
  }

  &__knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 17px;
    height: 17px;
    border-radius: 50%;
    background: $surface;
    box-shadow: $shadow-sm;
    @include transition(transform);
  }

  &--on &__track {
    background: $ink;
  }

  &--on &__knob {
    transform: translateX(17px);
    background: $accent;
  }

  input:focus-visible + &__track {
    outline: 2px solid $accent;
    outline-offset: 2px;
  }

  &__text {
    @include flex(column, flex-start, flex-start, 0);
  }

  &__label {
    font-size: 0.9rem;
    font-weight: 600;
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
  }
}
</style>
