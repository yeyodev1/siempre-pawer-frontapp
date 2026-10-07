<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { copy } from '@/config/copy'
import type { ApiError } from '@/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()
const t = copy.login

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const user = await userStore.login(email.value.trim(), password.value)
    toast.success(`Hola, ${user.name || user.email}`)
    const isAdmin = user.accountType === 'admin'
    const next = typeof route.query.next === 'string' ? route.query.next : ''
    // Un distribuidor nunca debe caer en /admin aunque venga en ?next=.
    const allowed = next && (isAdmin || !next.startsWith('/admin'))
    router.replace(allowed ? next : isAdmin ? '/admin' : '/tienda')
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="login">
    <form class="login__card" @submit.prevent="submit">
      <span class="login__eyebrow">{{ t.eyebrow }}</span>
      <h1 class="login__title">{{ t.title }}</h1>
      <p class="login__text">{{ t.text }}</p>

      <div>
        <label for="email">{{ t.email }}</label>
        <input id="email" v-model="email" type="email" autocomplete="email" required />
      </div>
      <div>
        <label for="password">{{ t.password }}</label>
        <input id="password" v-model="password" type="password" autocomplete="current-password" required />
      </div>

      <p v-if="error" class="login__error" role="alert">
        <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
      </p>

      <button class="btn btn--primary btn--sport btn--lg btn--block" type="submit" :disabled="loading">
        <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
        {{ loading ? t.loading : t.submit }}
      </button>

      <p class="login__foot">
        {{ t.noAccount }} <RouterLink to="/distribuidores">{{ t.noAccountCta }}</RouterLink>
      </p>
    </form>
  </section>
</template>

<style scoped lang="scss">
.login {
  @include container(460px);
  @include flex(column, stretch, center);
  flex: 1;
  padding-block: $space-xl;

  &__card {
    @include flex(column, stretch, flex-start, 1rem);
    border-top: 6px solid $ink;
    background: $sand;
    padding: 2rem 1.5rem;
  }

  &__eyebrow {
    align-self: flex-start;
    font-family: $font-condensed;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-size: 0.8rem;
    background: $accent;
    color: $on-accent;
    padding: 0.2rem 0.75rem;
    transform: skewX(-12deg);
  }

  &__title {
    font-family: $font-display;
    font-weight: 400;
    font-size: $display-md;
    text-transform: uppercase;
    line-height: 0.95;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__error {
    font-size: $text-sm;
    color: $danger;
    background: $danger-bg;
    padding: 0.6rem 0.8rem;
  }

  &__foot {
    font-size: $text-sm;
    text-align: center;
    color: $ink-soft;

    a {
      color: $ink;
      font-weight: 600;
      text-decoration: underline;
    }
  }
}
</style>
