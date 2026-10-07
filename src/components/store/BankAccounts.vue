<script setup lang="ts">
import { ref } from 'vue'
import { copy } from '@/config/copy'
import { whatsappLink } from '@/config/site'
import type { BankAccount } from '@/types'

defineProps<{ accounts: BankAccount[]; orderNumber: string }>()
const copied = ref('')

async function copyNumber(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    copied.value = value
    setTimeout(() => (copied.value = ''), 2000)
  } catch {
    /* sin portapapeles el número igual está a la vista */
  }
}
</script>

<template>
  <div class="banks">
    <p class="banks__hint">{{ copy.order.bankHint }} <strong>{{ orderNumber }}</strong></p>
    <article v-for="a in accounts" :key="a.number" class="bank">
      <p class="bank__name">{{ a.bank }} <span>{{ a.type }}</span></p>
      <button type="button" class="bank__number" @click="copyNumber(a.number)">
        {{ a.number }}
        <i :class="copied === a.number ? 'fa-solid fa-check' : 'fa-regular fa-copy'"></i>
      </button>
      <p class="bank__holder">{{ a.holder }}<template v-if="a.documentId"> · {{ a.documentId }}</template></p>
    </article>
    <p v-if="!accounts.length" class="banks__hint">
      <a :href="whatsappLink(`Hola, necesito los datos bancarios para el pedido ${orderNumber}`)" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp"></i> {{ copy.order.bankEmpty }}
      </a>
    </p>
  </div>
</template>

<style scoped lang="scss">
.banks {
  @include flex(column, stretch, flex-start, 0.7rem);

  &__hint {
    font-size: $text-sm;
    color: $ink-soft;

    a {
      text-decoration: underline;
      color: $ink;
    }
  }
}

.bank {
  border-left: 4px solid $accent;
  background: $paper;
  padding: 0.8rem 1rem;

  &__name {
    font-weight: 700;

    span {
      font-weight: 400;
      color: $ink-soft;
      font-size: $text-sm;
    }
  }

  &__number {
    font-family: $font-condensed;
    font-weight: 700;
    font-size: 1.35rem;
    letter-spacing: 0.06em;
    @include flex(row, center, flex-start, 0.6rem);

    i {
      font-size: 0.9rem;
      color: $ink-soft;
    }
  }

  &__holder {
    font-size: $text-sm;
    color: $ink-soft;
  }
}
</style>
