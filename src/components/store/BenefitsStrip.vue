<script setup lang="ts">
import { site } from '@/config/site'
</script>

<template>
  <section class="benefits">
    <div class="benefits__inner">
      <article v-for="b in site.benefits" :key="b.title" class="benefit">
        <i :class="b.icon" class="benefit__icon"></i>
        <div>
          <h3 class="benefit__title">{{ b.title }}</h3>
          <p class="benefit__text">{{ b.text }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
.benefits {
  border-bottom: 1px solid $line;

  &__inner {
    @include container(1280px);
    @include flex-cards(240px, 1.5rem);
    padding-block: 1.8rem;
  }
}

.benefit {
  @include flex(row, flex-start, flex-start, 0.9rem);

  &__icon {
    font-size: 1.35rem;
    color: $ink;
    width: 2.8rem;
    height: 2.8rem;
    flex-shrink: 0;
    background: $accent;
    @include flex(row, center, center);
    clip-path: polygon(14% 0, 100% 0, 86% 100%, 0 100%);
  }

  &__title {
    font-family: $font-condensed;
    font-weight: 700;
    font-size: 1.05rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    line-height: 1.2;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.45;
  }
}
</style>
