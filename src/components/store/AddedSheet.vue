<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useRouter } from 'vue-router'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useAddToCart } from '@/composables/useAddToCart'
import { useCartStore } from '@/stores/cart'
import { site } from '@/config/site'
import { money } from '@/utils/format'
import type { Product } from '@/types'

const props = defineProps<{
  open: boolean
  product: Product
  qty: number
  variant: string
  unit: number
  related: Product[]
}>()
const emit = defineEmits<{ close: [] }>()

const router = useRouter()
const cart = useCartStore()
const { add } = useAddToCart()
useBodyScroll(toRef(props, 'open'))

// Venta cruzada: solo lo que se puede agregar con un toque (sin talla ni color).
const extras = computed(() => props.related.filter((p) => p.stock > 0).slice(0, 4))

function goCart() {
  emit('close')
  router.push('/carrito')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="sheet" @click.self="emit('close')">
        <div class="sheet__box" role="dialog" aria-modal="true" :aria-label="site.added.title">
          <p class="sheet__ok"><i class="fa-solid fa-circle-check"></i> {{ site.added.title }}</p>

          <div class="sheet__line">
            <img v-if="product.images?.[0]" :src="product.images[0]" :alt="product.name" />
            <div>
              <strong>{{ product.name }}</strong>
              <span v-if="variant">{{ variant }}</span>
              <span>{{ qty }} {{ qty === 1 ? 'unidad' : 'unidades' }} · {{ money(unit * qty) }}</span>
            </div>
          </div>

          <div class="sheet__actions">
            <button type="button" class="btn btn--ghost btn--sport btn--block" @click="emit('close')">
              {{ site.added.keepShopping }}
            </button>
            <button type="button" class="btn btn--primary btn--sport btn--block" @click="goCart">
              {{ site.added.goCart }} · {{ money(cart.estimatedSubtotal()) }}
            </button>
          </div>

          <template v-if="extras.length">
            <h3 class="sheet__title">{{ site.added.crossSell }}</h3>
            <ul class="sheet__extras">
              <li v-for="p in extras" :key="p._id" class="extra">
                <img v-if="p.images?.[0]" :src="p.images[0]" :alt="p.name" loading="lazy" />
                <RouterLink :to="`/producto/${p.slug}`" class="extra__name" @click="emit('close')">
                  {{ p.name }}
                  <small>{{ money(p.prices.card) }}</small>
                </RouterLink>
                <RouterLink
                  v-if="p.variants?.length"
                  :to="`/producto/${p.slug}`"
                  class="extra__add"
                  :aria-label="`Ver opciones de ${p.name}`"
                  @click="emit('close')"
                >
                  <i class="fa-solid fa-chevron-right"></i>
                </RouterLink>
                <button v-else type="button" class="extra__add" :aria-label="`Agregar ${p.name}`" @click="add(p)">
                  <i class="fa-solid fa-plus"></i>
                </button>
              </li>
            </ul>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.sheet {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba($night, 0.55);
  @include flex(column, center, flex-end);

  @include from('md') {
    justify-content: center;
  }

  &__box {
    width: min(100%, 480px);
    max-height: 88dvh;
    overflow-y: auto;
    background: $paper;
    border-radius: 18px 18px 0 0;
    padding: 1.25rem 1.25rem calc(1.25rem + env(safe-area-inset-bottom));
    @include flex(column, stretch, flex-start, 1rem);

    @include from('md') {
      border-radius: 18px;
    }
  }

  &__ok {
    font-family: $font-condensed;
    font-weight: 700;
    font-size: 1.15rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: $success;
  }

  &__line {
    @include flex(row, center, flex-start, 0.9rem);

    img {
      width: 4.5rem;
      height: 4.5rem;
      object-fit: contain;
      background: $sand;
      border-radius: 10px;
    }

    div {
      @include flex(column, flex-start, flex-start, 0.1rem);
      font-size: $text-sm;
      color: $ink-soft;
    }

    strong {
      color: $ink;
      font-size: 1rem;
    }
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.6rem);
  }

  &__title {
    font-family: $font-display;
    font-weight: 400;
    font-style: italic;
    font-size: 1.6rem;
    text-transform: uppercase;
    margin-top: 0.5rem;
  }

  &__extras {
    list-style: none;
    padding: 0;
    margin: 0;
    @include flex(column, stretch, flex-start, 0.6rem);
  }
}

.extra {
  @include flex(row, center, flex-start, 0.75rem);

  img {
    width: 3.2rem;
    height: 3.2rem;
    object-fit: contain;
    background: $sand;
    border-radius: 8px;
  }

  &__name {
    flex: 1;
    min-width: 0;
    font-weight: 600;
    font-size: $text-sm;
    @include flex(column, flex-start, flex-start);

    small {
      font-weight: 500;
      color: $ink-muted;
    }
  }

  &__add {
    width: 2.2rem;
    height: 2.2rem;
    flex-shrink: 0;
    border-radius: 50%;
    background: $accent;
    color: $on-accent;
    @include flex(row, center, center);
  }
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s $ease;

  .sheet__box {
    transition: transform 0.3s $ease;
  }
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;

  .sheet__box {
    transform: translateY(40px);
  }
}
</style>
