<script setup lang="ts">
import { ref } from 'vue'

// Si /logo-white.svg aún no está en public/, queda el texto de la marca.
const failed = ref(false)
</script>

<template>
  <RouterLink :to="{ name: 'AdminDashboard' }" class="logo" aria-label="Siempre Pawer, panel">
    <img v-if="!failed" src="/logo-white.svg" alt="Siempre Pawer" class="logo__img" @error="failed = true" />
    <span v-else class="logo__text">PAWER</span>
    <span class="logo__tag">Admin</span>
  </RouterLink>
</template>

<style scoped lang="scss">
.logo {
  @include flex(row, center, flex-start, 0.6rem);

  &__img {
    height: 30px;
    width: auto;
  }

  &__text {
    font-family: $font-display;
    font-size: 1.9rem;
    line-height: 1;
    letter-spacing: 0.06em;
    color: $accent;
  }

  &__tag {
    font-family: $font-condensed;
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba($surface, 0.55);
    border: 1px solid rgba($surface, 0.2);
    border-radius: 4px;
    padding: 0.1rem 0.4rem;
  }
}
</style>
