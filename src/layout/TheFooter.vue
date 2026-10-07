<script setup lang="ts">
import { ref } from 'vue'
import { site, whatsappLink } from '@/config/site'
import { copy, policyLinks } from '@/config/copy'

const year = new Date().getFullYear()
const logoFailed = ref(false)

const socials = [
  { href: site.social.instagram, icon: 'fa-brands fa-instagram', label: 'Instagram' },
  { href: site.social.facebook, icon: 'fa-brands fa-facebook-f', label: 'Facebook' },
  { href: site.social.tiktok, icon: 'fa-brands fa-tiktok', label: 'TikTok' },
].filter((s) => s.href)
</script>

<template>
  <footer class="footer">
    <div class="footer__slogan" aria-hidden="true">{{ site.name }}</div>

    <div class="footer__inner">
      <div class="footer__brand">
        <img v-if="!logoFailed" src="/logo-white.svg" :alt="site.name" class="footer__logo" @error="logoFailed = true" />
        <span v-else class="footer__name">{{ site.name }}</span>
        <p class="footer__tagline">{{ site.slogan }}. {{ site.tagline }}</p>
        <p class="footer__city"><i class="fa-solid fa-location-dot"></i> {{ site.city }}</p>
        <div class="footer__socials">
          <a v-for="s in socials" :key="s.label" :href="s.href" target="_blank" rel="noopener" :aria-label="s.label">
            <i :class="s.icon"></i>
          </a>
        </div>
      </div>

      <div class="footer__col">
        <h4 class="footer__heading">{{ copy.footer.shop }}</h4>
        <RouterLink v-for="link in site.nav" :key="link.to" :to="link.to">{{ link.label }}</RouterLink>
        <RouterLink to="/login">{{ copy.footer.login }}</RouterLink>
      </div>

      <div class="footer__col">
        <h4 class="footer__heading">{{ copy.footer.policies }}</h4>
        <RouterLink v-for="p in policyLinks" :key="p.slug" :to="`/politicas/${p.slug}`">{{ p.label }}</RouterLink>
      </div>

      <div class="footer__col">
        <h4 class="footer__heading">{{ copy.footer.help }}</h4>
        <a v-if="site.whatsapp" :href="whatsappLink()" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp"></i> {{ site.whatsappDisplay }}
        </a>
        <a :href="`mailto:${site.email}`"><i class="fa-solid fa-envelope"></i> {{ site.email }}</a>
      </div>
    </div>

    <div class="footer__bar">
      <span>&copy; {{ year }} {{ site.name }}</span>
      <span>Hecho por <a href="https://bakano.ec" target="_blank" rel="noopener">Bakano</a></span>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background: $night;
  color: rgba($paper, 0.8);
  margin-top: auto;
  overflow: hidden;

  &__slogan {
    font-family: $font-display;
    font-size: clamp(4rem, 17vw, 15rem);
    line-height: 0.8;
    text-transform: uppercase;
    white-space: nowrap;
    color: transparent;
    -webkit-text-stroke: 1px rgba($accent, 0.35);
    padding: 2.5rem 0 0 1rem;
    user-select: none;
  }

  &__inner {
    @include container(1280px);
    @include flex-cards(180px, 2rem);
    padding-block: 2.5rem 2rem;
  }

  &__brand {
    flex: 2 1 260px !important;
    @include flex(column, flex-start, flex-start, 0.7rem);
  }

  &__logo {
    height: 42px;
    width: auto;
  }

  &__name {
    font-family: $font-display;
    font-size: 2rem;
    color: $paper;
    text-transform: uppercase;
  }

  &__tagline,
  &__city {
    font-size: $text-sm;
    color: rgba($paper, 0.6);
    max-width: 34ch;
  }

  &__city i {
    color: $accent;
    margin-right: 0.3rem;
  }

  &__socials {
    @include flex(row, center, flex-start, 0.5rem);
    margin-top: 0.4rem;

    a {
      width: 2.4rem;
      height: 2.4rem;
      border: 1px solid rgba($paper, 0.2);
      border-radius: 50%;
      @include flex(row, center, center);
      @include transition;

      &:hover {
        background: $accent;
        border-color: $accent;
        color: $on-accent;
      }
    }
  }

  &__col {
    @include flex(column, flex-start, flex-start, 0.6rem);
    font-size: $text-sm;

    a {
      color: rgba($paper, 0.75);
      overflow-wrap: anywhere;
      @include transition(color);

      &:hover {
        color: $accent;
      }
    }
  }

  &__heading {
    font-family: $font-condensed;
    font-weight: 700;
    font-size: 0.85rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: $accent;
    margin-bottom: 0.3rem;
  }

  &__bar {
    @include container(1280px);
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
    padding-block: 1.2rem;
    border-top: 1px solid rgba($paper, 0.1);
    font-size: $text-xs;
    color: rgba($paper, 0.5);

    a {
      color: rgba($paper, 0.8);
    }
  }
}
</style>
