<script setup lang="ts">
import { copy } from '@/config/copy'
import { whatsappLink } from '@/config/site'
import SectionHead from '@/components/store/SectionHead.vue'

const t = copy.distributors
</script>

<template>
  <div class="dist">
    <section class="dist__hero">
      <div class="dist__hero-inner">
        <SectionHead as="h1" dark :eyebrow="t.eyebrow" :title="t.title">
          <p class="dist__lead">{{ t.text }}</p>
        </SectionHead>
        <div class="dist__actions">
          <a :href="whatsappLink(t.whatsappMessage)" target="_blank" rel="noopener" class="btn btn--primary btn--sport btn--lg">
            <i class="fa-brands fa-whatsapp"></i> {{ t.cta }}
          </a>
          <RouterLink to="/login" class="btn btn--light btn--sport btn--lg">{{ t.login }}</RouterLink>
        </div>
      </div>
    </section>

    <section class="dist__section">
      <div class="dist__cards">
        <article v-for="a in t.audiences" :key="a.title" class="aud">
          <i :class="a.icon" class="aud__icon"></i>
          <h2 class="aud__title">{{ a.title }}</h2>
          <p class="aud__text">{{ a.text }}</p>
        </article>
      </div>
    </section>

    <section class="dist__section">
      <SectionHead :title="t.stepsTitle" />
      <ol class="dist__steps">
        <li v-for="(s, i) in t.steps" :key="s.title" class="step">
          <span class="step__n">{{ i + 1 }}</span>
          <div>
            <h3 class="step__title">{{ s.title }}</h3>
            <p class="step__text">{{ s.text }}</p>
          </div>
        </li>
      </ol>
      <a :href="whatsappLink(t.whatsappMessage)" target="_blank" rel="noopener" class="btn btn--whatsapp btn--sport btn--lg dist__cta">
        <i class="fa-brands fa-whatsapp"></i> {{ t.cta }}
      </a>
    </section>
  </div>
</template>

<style scoped lang="scss">
.dist {
  &__hero {
    background: $night;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: -8%;
      width: 28%;
      background: $accent;
      transform: skewX(-18deg);
    }
  }

  &__hero-inner {
    @include container(1280px);
    @include flex(column, flex-start, flex-start, 1.75rem);
    padding-block: $space-xl;
    position: relative;
    z-index: 1;

    :deep(.head__title) {
      font-size: $display-lg;
      max-width: 14ch;
    }
  }

  &__lead {
    color: rgba($paper, 0.75);
    max-width: 52ch;
    font-size: $text-lg;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
  }

  &__section {
    @include container(1280px);
    @include flex(column, stretch, flex-start, 1.75rem);
    padding-block: $space-xl 0;

    &:last-child {
      padding-bottom: $space-xl;
    }
  }

  &__cards {
    @include flex-cards(240px, 1rem);
  }

  &__steps {
    list-style: none;
    @include flex-cards(240px, 1.5rem);
  }

  &__cta {
    align-self: flex-start;
  }
}

.aud {
  border-top: 4px solid $ink;
  background: $sand;
  padding: 1.5rem 1.3rem;
  @include flex(column, flex-start, flex-start, 0.6rem);

  &__icon {
    font-size: 1.6rem;
    color: $accent-deep;
  }

  &__title {
    font-family: $font-display;
    font-weight: 400;
    font-size: 2rem;
    text-transform: uppercase;
    line-height: 1;
  }

  &__text {
    color: $ink-soft;
    font-size: $text-sm;
  }
}

.step {
  @include flex(row, flex-start, flex-start, 1rem);

  &__n {
    font-family: $font-display;
    font-size: 3.5rem;
    line-height: 0.8;
    color: $accent;
    -webkit-text-stroke: 1px $ink;
  }

  &__title {
    font-family: $font-condensed;
    font-weight: 700;
    font-size: 1.15rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  &__text {
    color: $ink-soft;
    font-size: $text-sm;
  }
}
</style>
