<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { copy } from '@/config/copy'
import SectionHead from '@/components/store/SectionHead.vue'

const router = useRouter()
const number = ref('')
const email = ref('')
const t = copy.track

function submit() {
  const clean = number.value.trim().toUpperCase().replace(/\s+/g, '')
  // Aceptamos "1001" o "PW-1001": el número siempre lleva el prefijo.
  const normalized = /^\d+$/.test(clean) ? `PW-${clean}` : clean
  router.push({ name: 'OrderTrack', params: { number: normalized }, query: { email: email.value.trim().toLowerCase() } })
}
</script>

<template>
  <section class="track">
    <SectionHead as="h1" :eyebrow="t.eyebrow" :title="t.title">
      <p class="track__text">{{ t.text }}</p>
    </SectionHead>
    <form class="track__form" @submit.prevent="submit">
      <div>
        <label for="track-number">{{ t.number }}</label>
        <input id="track-number" v-model="number" placeholder="PW-1001" autocapitalize="characters" required />
      </div>
      <div>
        <label for="track-mail">{{ t.email }}</label>
        <input id="track-mail" v-model="email" type="email" autocomplete="email" required />
      </div>
      <button type="submit" class="btn btn--primary btn--sport btn--lg btn--block">
        {{ t.submit }} <i class="fa-solid fa-arrow-right"></i>
      </button>
    </form>
  </section>
</template>

<style scoped lang="scss">
.track {
  @include container(560px);
  padding-block: $space-xl;
  @include flex(column, stretch, flex-start, 1.75rem);

  &__text {
    color: $ink-soft;
  }

  &__form {
    @include flex(column, stretch, flex-start, 1rem);
    border-top: 2px solid $ink;
    padding-top: 1.5rem;
  }
}
</style>
