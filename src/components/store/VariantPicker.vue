<script setup lang="ts">
defineProps<{ sizes: string[]; colors: string[] }>()
const size = defineModel<string>('size', { required: true })
const color = defineModel<string>('color', { required: true })
</script>

<template>
  <div class="picker">
    <fieldset v-if="sizes.length" class="picker__group">
      <legend class="picker__label">Talla <strong>{{ size }}</strong></legend>
      <div class="picker__options">
        <button
          v-for="s in sizes"
          :key="s"
          type="button"
          class="opt"
          :class="{ 'opt--active': size === s }"
          :aria-pressed="size === s"
          @click="size = s"
        >
          {{ s }}
        </button>
      </div>
    </fieldset>

    <fieldset v-if="colors.length" class="picker__group">
      <legend class="picker__label">Color <strong>{{ color }}</strong></legend>
      <div class="picker__options">
        <button
          v-for="c in colors"
          :key="c"
          type="button"
          class="opt"
          :class="{ 'opt--active': color === c }"
          :aria-pressed="color === c"
          @click="color = c"
        >
          {{ c }}
        </button>
      </div>
    </fieldset>
  </div>
</template>

<style scoped lang="scss">
.picker {
  @include flex(column, stretch, flex-start, 1rem);

  &__group {
    border: 0;
    padding: 0;
    margin: 0;
  }

  &__label {
    font-family: $font-condensed;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;

    strong {
      font-family: $font-body;
      font-weight: 500;
      letter-spacing: 0;
      text-transform: none;
      color: $ink-soft;
      margin-left: 0.3rem;
    }
  }

  &__options {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }
}

.opt {
  min-width: 3.2rem;
  padding: 0.55rem 0.9rem;
  border: 1.5px solid $line;
  border-radius: 8px;
  background: $paper;
  font-weight: 600;
  font-size: $text-sm;
  @include transition;

  &:hover {
    border-color: $ink;
  }

  &--active,
  &--active:hover {
    border-color: $ink;
    background: $ink;
    color: $accent;
  }
}
</style>
