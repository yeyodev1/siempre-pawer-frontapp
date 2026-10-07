<script setup lang="ts">
import { site } from '@/config/site'
import { copy } from '@/config/copy'
import { money } from '@/utils/format'
import type { Product } from '@/types'

defineProps<{ product?: Product | null }>()
</script>

<template>
  <section class="hero">
    <div class="hero__inner">
      <div class="hero__copy">
        <span class="hero__eyebrow">{{ site.hero.eyebrow }}</span>
        <h1 class="hero__title">{{ site.hero.title }}</h1>
        <p class="hero__text">{{ site.hero.text }}</p>
        <div class="hero__actions">
          <RouterLink to="/tienda" class="btn btn--primary btn--sport btn--lg">
            {{ site.hero.cta }} <i class="fa-solid fa-arrow-right"></i>
          </RouterLink>
          <RouterLink to="/distribuidores" class="btn btn--light btn--sport btn--lg">
            {{ site.hero.ctaSecondary }}
          </RouterLink>
        </div>
      </div>

      <div class="hero__visual">
        <span class="hero__slash" aria-hidden="true"></span>
        <RouterLink v-if="product?.images?.[0]" :to="`/producto/${product.slug}`" class="hero__product">
          <img :src="product.images[0]" :alt="product.name" fetchpriority="high" />
          <span class="hero__tag">
            <small>{{ product.name }}</small>
            <strong>{{ money(product.prices.card) }}</strong>
          </span>
        </RouterLink>
        <div v-else class="hero__product hero__product--empty">
          <i class="fa-solid fa-futbol"></i>
          <span class="hero__tag"><strong>{{ copy.home.heroBadge }}</strong></span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  background: $night;
  color: $paper;
  overflow: hidden;

  &__inner {
    @include container(1280px);
    @include flex(column, stretch, flex-start, 2rem);
    padding-block: 2.5rem 3rem;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      padding-block: 4rem;
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1.1rem);
    flex: 1 1 55%;
    position: relative;
    z-index: 1;
  }

  &__eyebrow {
    font-family: $font-condensed;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-size: 0.85rem;
    color: $accent;
  }

  &__title {
    font-family: $font-display;
    font-weight: 400;
    text-transform: uppercase;
    font-size: clamp(3.4rem, 2rem + 7vw, 7.5rem);
    line-height: 0.86;
    letter-spacing: 0.005em;
    max-width: 9ch;
  }

  &__text {
    color: rgba($paper, 0.72);
    max-width: 44ch;
    font-size: $text-lg;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  &__visual {
    position: relative;
    flex: 1 1 45%;
    min-height: 300px;
    @include flex(row, center, center);

    @include from('md') {
      min-height: 480px;
    }
  }

  // El rayo dorado: una franja inclinada que cruza detrás del balón.
  &__slash {
    position: absolute;
    width: 46%;
    height: 140%;
    background: $accent;
    transform: skewX(-18deg);
    right: 18%;
  }

  &__product {
    position: relative;
    width: min(82%, 420px);
    aspect-ratio: 1;
    border-radius: 50%;
    background: $paper;
    @include flex(row, center, center);
    box-shadow: 0 40px 80px rgba(#000, 0.45);

    img {
      width: 82%;
      height: 82%;
      object-fit: contain;
      transition: transform 0.6s $ease;
    }

    &:hover img {
      transform: rotate(-12deg) scale(1.04);
    }

    &--empty i {
      font-size: 9rem;
      color: $ink;
    }
  }

  &__tag {
    position: absolute;
    left: -4%;
    bottom: 8%;
    background: $ink;
    color: $paper;
    padding: 0.55rem 1rem;
    transform: skewX(-12deg);
    @include flex(column, flex-start, flex-start);
    max-width: 70%;

    small {
      font-family: $font-condensed;
      font-size: 0.78rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: rgba($paper, 0.7);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }

    strong {
      font-family: $font-display;
      font-weight: 400;
      font-size: 1.8rem;
      line-height: 1;
      color: $accent;
    }
  }
}
</style>
