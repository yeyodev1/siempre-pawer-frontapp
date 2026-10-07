<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { copy } from '@/config/copy'

defineProps<{ dark?: boolean }>()
const emit = defineEmits<{ done: [] }>()

const route = useRoute()
const router = useRouter()
const term = ref('')

watch(
  () => route.query.search,
  (value) => (term.value = typeof value === 'string' ? value : ''),
  { immediate: true },
)

function submit() {
  const search = term.value.trim()
  router.push({ path: '/tienda', query: search ? { search } : {} })
  emit('done')
}
</script>

<template>
  <form class="search" role="search" @submit.prevent="submit">
    <label for="header-search" class="visually-hidden">{{ copy.shop.searchLabel }}</label>
    <input
      id="header-search"
      v-model="term"
      class="search__input"
      type="search"
      :placeholder="copy.shop.searchPlaceholder"
      autocomplete="off"
    />
    <button class="search__btn" type="submit" :aria-label="copy.shop.searchLabel">
      <i class="fa-solid fa-magnifying-glass"></i>
    </button>
  </form>
</template>

<style scoped lang="scss">
.search {
  position: relative;
  width: 100%;

  &__input {
    background: $sand;
    border-color: transparent;
    border-radius: $radius-pill;
    padding: 0.6rem 2.8rem 0.6rem 1.1rem;
    font-size: 0.9rem;

    &:focus {
      background: $paper;
    }
  }

  &__btn {
    position: absolute;
    right: 0.3rem;
    top: 50%;
    transform: translateY(-50%);
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    @include flex(row, center, center);
    color: $ink;

    &:hover {
      background: $accent;
    }
  }
}
</style>
