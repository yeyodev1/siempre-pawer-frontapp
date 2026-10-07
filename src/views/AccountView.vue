<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { copy } from '@/config/copy'
import SectionHead from '@/components/store/SectionHead.vue'

const router = useRouter()
const userStore = useUserStore()
const t = copy.account

const rows = computed(() => {
  const u = userStore.user
  if (!u) return []
  return [
    { label: t.fields.name, value: u.name },
    { label: t.fields.email, value: u.email },
    { label: t.fields.phone, value: u.phone },
    { label: t.fields.company, value: u.company },
  ].filter((r) => r.value)
})

function logout() {
  userStore.clear()
  router.replace('/')
}
</script>

<template>
  <section class="account">
    <SectionHead as="h1" :eyebrow="t.eyebrow" :title="userStore.user?.name || t.eyebrow" />

    <p v-if="userStore.isDistributor" class="account__notice">
      <i class="fa-solid fa-tags"></i> {{ t.distributorNotice }}
    </p>
    <p v-else-if="userStore.isAdmin" class="account__notice">
      <i class="fa-solid fa-shield-halved"></i> {{ t.adminNotice }}
    </p>

    <dl class="account__data">
      <div v-for="r in rows" :key="r.label">
        <dt>{{ r.label }}</dt>
        <dd>{{ r.value }}</dd>
      </div>
    </dl>

    <div class="account__actions">
      <RouterLink v-if="userStore.isAdmin" to="/admin" class="btn btn--dark btn--sport">{{ t.adminCta }}</RouterLink>
      <RouterLink to="/tienda" class="btn btn--primary btn--sport">{{ t.shopCta }}</RouterLink>
      <button type="button" class="btn btn--ghost btn--sport" @click="logout">
        <i class="fa-solid fa-right-from-bracket"></i> {{ t.logout }}
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.account {
  @include container(720px);
  padding-block: 2rem $space-xl;
  @include flex(column, stretch, flex-start, 1.5rem);

  &__notice {
    background: $ink;
    color: $paper;
    padding: 1rem 1.2rem;
    border-left: 6px solid $accent;

    i {
      color: $accent;
      margin-right: 0.4rem;
    }
  }

  &__data {
    border-top: 2px solid $ink;

    div {
      @include flex(row, baseline, space-between, 1rem);
      padding: 0.75rem 0;
      border-bottom: 1px solid $line;
    }

    dt {
      font-family: $font-condensed;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: $ink-soft;
    }

    dd {
      font-weight: 600;
      text-align: right;
      overflow-wrap: anywhere;
    }
  }

  &__actions {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
  }
}
</style>
