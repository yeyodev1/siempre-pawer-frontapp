<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { policies, policyLinks } from '@/config/copy'
import { site } from '@/config/site'
import SectionHead from '@/components/store/SectionHead.vue'
import NotFoundView from './NotFoundView.vue'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const policy = computed(() => policies[slug.value] || null)

watch(policy, (p) => p && (document.title = `${p.title} — ${site.name}`), { immediate: true })
</script>

<template>
  <NotFoundView v-if="!policy" />
  <div v-else class="policy">
    <nav class="policy__nav" aria-label="Políticas">
      <RouterLink v-for="p in policyLinks" :key="p.slug" :to="`/politicas/${p.slug}`" class="policy__tab">
        {{ p.label }}
      </RouterLink>
    </nav>
    <article class="policy__body">
      <SectionHead as="h1" eyebrow="Políticas" :title="policy.title">
        <p class="policy__intro">{{ policy.intro }}</p>
      </SectionHead>
      <section v-for="s in policy.sections" :key="s.heading" class="policy__section">
        <h2>{{ s.heading }}</h2>
        <p v-for="(para, i) in s.body" :key="i">{{ para }}</p>
      </section>
      <p class="policy__contact">
        {{ site.email }} · {{ site.whatsappDisplay }} · {{ site.city }}
      </p>
    </article>
  </div>
</template>

<style scoped lang="scss">
.policy {
  @include container(820px);
  padding-block: 2rem $space-xl;
  @include flex(column, stretch, flex-start, 2rem);

  &__nav {
    @include flex(row, center, flex-start, 0.5rem);
    overflow-x: auto;
    scrollbar-width: none;
    border-bottom: 1px solid $line;
  }

  &__tab {
    flex-shrink: 0;
    font-family: $font-condensed;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    font-size: 0.92rem;
    padding: 0.6rem 0.4rem;
    color: $ink-muted;
    border-bottom: 3px solid transparent;

    &.router-link-active {
      color: $ink;
      border-color: $accent;
    }
  }

  &__body {
    @include flex(column, stretch, flex-start, 1.75rem);
  }

  &__intro {
    color: $ink-soft;
    font-size: $text-lg;
  }

  &__section {
    @include flex(column, stretch, flex-start, 0.6rem);

    h2 {
      font-family: $font-condensed;
      font-weight: 700;
      font-size: 1.2rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    p {
      color: $ink-soft;
    }
  }

  &__contact {
    border-top: 1px solid $line;
    padding-top: 1rem;
    font-size: $text-sm;
    color: $ink-muted;
  }
}
</style>
