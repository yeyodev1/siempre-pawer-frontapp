<script setup lang="ts">
import { site } from '@/config/site'
</script>

<template>
  <section class="band">
    <div class="band__inner">
      <h2 class="band__title">{{ site.wholesale.title }}</h2>
      <div class="band__side">
        <p class="band__text">{{ site.wholesale.text }}</p>
        <RouterLink to="/distribuidores" class="btn btn--dark btn--sport btn--lg">
          {{ site.wholesale.cta }} <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.band {
  background: $accent;
  color: $on-accent;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: -10%;
    width: 40%;
    background: rgba($paper, 0.18);
    transform: skewX(-18deg);
  }

  &__inner {
    @include container(1280px);
    @include flex(column, flex-start, flex-start, 1.5rem);
    padding-block: $space-xl;
    position: relative;

    @include from('md') {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
      gap: 3rem;
    }
  }

  &__title {
    font-family: $font-display;
    font-weight: 400;
    font-size: $display-lg;
    line-height: 0.9;
    text-transform: uppercase;
    max-width: 12ch;
  }

  &__side {
    @include flex(column, flex-start, flex-start, 1.2rem);
    max-width: 440px;
  }

  &__text {
    font-size: $text-lg;
    font-weight: 500;
  }
}
</style>
