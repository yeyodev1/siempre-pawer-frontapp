<script setup lang="ts">
import { site, whatsappLink } from '@/config/site'
import { useSchoolQuote } from '@/composables/useSchoolQuote'
import QtyStepper from '@/components/store/QtyStepper.vue'

const t = site.quote
const {
  mode, term, results, searching, items, custom, file, form, sending, sent,
  addProduct, addCustom, removeItem, pickFile, submit,
} = useSchoolQuote()
</script>

<template>
  <div class="quote">
    <nav class="quote__crumbs" aria-label="Ruta">
      <RouterLink to="/">Inicio</RouterLink> <span>/</span> <span>Colegios</span>
    </nav>
    <h1 class="quote__title">{{ t.title }}</h1>

    <div v-if="sent" class="quote__done">
      <i class="fa-solid fa-circle-check"></i>
      <h2>{{ t.successTitle }}</h2>
      <p>{{ t.successText }}</p>
      <RouterLink to="/tienda" class="btn btn--primary btn--sport">{{ t.successCta }}</RouterLink>
      <a v-if="site.whatsapp" :href="whatsappLink(`Hola, envié una cotización para ${form.institution}`)" target="_blank" rel="noopener" class="btn btn--whatsapp btn--sport">
        <i class="fa-brands fa-whatsapp"></i> WhatsApp
      </a>
    </div>

    <form v-else class="quote__form" @submit.prevent="submit">
      <p class="quote__intro">{{ t.intro }}</p>

      <div class="quote__modes" role="tablist">
        <button type="button" role="tab" class="mode" :class="{ 'mode--active': mode === 'build' }" :aria-selected="mode === 'build'" @click="mode = 'build'">
          {{ t.tabBuild }}
        </button>
        <button type="button" role="tab" class="mode" :class="{ 'mode--active': mode === 'upload' }" :aria-selected="mode === 'upload'" @click="mode = 'upload'">
          {{ t.tabUpload }}
        </button>
      </div>

      <section v-if="mode === 'build'" class="quote__build">
        <div class="quote__search">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input v-model="term" type="search" autocomplete="off" :placeholder="t.searchPlaceholder" :aria-label="t.searchPlaceholder" />
          <i v-if="searching" class="fa-solid fa-spinner fa-spin"></i>
        </div>
        <ul v-if="results.length" class="quote__results">
          <li v-for="p in results" :key="p._id">
            <button type="button" @click="addProduct(p)">
              <img v-if="p.images?.[0]" :src="p.images[0]" alt="" />
              <span>{{ p.name }}</span>
              <i class="fa-solid fa-plus"></i>
            </button>
          </li>
        </ul>

        <p v-if="!items.length" class="quote__empty">{{ t.emptyList }}</p>
        <ul v-else class="quote__items">
          <li v-for="(item, i) in items" :key="item.name + i" class="item">
            <span class="item__name">{{ item.name }}</span>
            <QtyStepper v-model="item.qty" :max="99999" small />
            <button type="button" class="item__remove" :aria-label="`Quitar ${item.name}`" @click="removeItem(i)">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </li>
        </ul>

        <div class="quote__custom">
          <input v-model="custom" type="text" :placeholder="t.customPlaceholder" :aria-label="t.customPlaceholder" @keydown.enter.prevent="addCustom" />
          <button type="button" class="btn btn--ghost" @click="addCustom"><i class="fa-solid fa-plus"></i> {{ t.addCustom }}</button>
        </div>
      </section>

      <section v-else class="quote__upload">
        <label class="quote__file">
          <i class="fa-solid fa-file-arrow-up"></i>
          <strong>{{ file ? file.name : t.uploadCta }}</strong>
          <small>{{ t.uploadHint }}</small>
          <input type="file" accept=".pdf,.xls,.xlsx,.doc,.docx,image/*" class="visually-hidden" @change="pickFile" />
        </label>
      </section>

      <div class="quote__fields">
        <label>{{ t.fields.institution }}<input v-model="form.institution" required autocomplete="organization" /></label>
        <label>{{ t.fields.name }}<input v-model="form.name" required autocomplete="name" /></label>
        <label>{{ t.fields.phone }}<input v-model="form.phone" required type="tel" autocomplete="tel" /></label>
        <label>{{ t.fields.email }}<input v-model="form.email" type="email" autocomplete="email" /></label>
        <label>{{ t.fields.city }}<input v-model="form.city" autocomplete="address-level2" /></label>
      </div>
      <label class="quote__notes">{{ t.fields.notes }}<textarea v-model="form.notes" rows="3"></textarea></label>

      <button type="submit" class="btn btn--primary btn--sport btn--lg btn--block" :disabled="sending">
        <i v-if="sending" class="fa-solid fa-spinner fa-spin"></i> {{ t.submit }}
      </button>
      <p class="quote__note">{{ t.footnote }}</p>
    </form>
  </div>
</template>

<style scoped lang="scss">
.quote {
  @include container(760px);
  padding-block: 1.25rem $space-xl;

  &__title {
    font-family: $font-display;
    font-weight: 400;
    font-style: italic;
    font-size: clamp(2.4rem, 1.8rem + 3vw, 4rem);
    line-height: 1;
    text-transform: uppercase;
    margin-block: 0.4rem 0.5rem;
  }

  &__crumbs,
  &__intro,
  &__empty,
  &__note {
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__note {
    text-align: center;
  }

  &__form,
  &__build {
    @include flex(column, stretch, flex-start, 1.1rem);
  }

  &__modes {
    @include flex(row, stretch, flex-start, 0.25rem);
    background: $sand;
    border-radius: 10px;
    padding: 0.25rem;
  }

  &__search {
    position: relative;

    i {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 1rem;
      color: $ink-muted;

      &.fa-spinner {
        left: auto;
        right: 1rem;
      }
    }

    input {
      padding-left: 2.6rem;
      border-radius: $radius-pill;
    }
  }

  &__results,
  &__items {
    list-style: none;
    padding: 0;
    margin: 0;
    @include flex(column, stretch, flex-start, 0.4rem);
  }

  &__results button {
    width: 100%;
    @include flex(row, center, flex-start, 0.75rem);
    padding: 0.4rem 0.6rem;
    border: 1px solid $line;
    border-radius: 8px;
    text-align: left;

    img {
      width: 2.5rem;
      height: 2.5rem;
      object-fit: contain;
    }

    span {
      flex: 1;
      font-weight: 600;
      font-size: $text-sm;
    }

    &:hover {
      border-color: $accent;
    }
  }

  &__custom {
    @include flex(row, stretch, flex-start, 0.5rem);
    flex-wrap: wrap;

    input {
      flex: 1 1 220px;
    }
  }

  &__file {
    cursor: pointer;
    @include flex(column, center, center, 0.4rem);
    text-align: center;
    padding: 2rem 1rem;
    border: 2px dashed $line;
    border-radius: 12px;

    i {
      font-size: 2rem;
    }

    small {
      color: $ink-muted;
    }

    &:hover {
      border-color: $accent;
    }
  }

  &__fields {
    @include flex-cards(240px, 0.9rem);

  }

  &__fields label,
  &__notes {
    @include flex(column, stretch, flex-start, 0.3rem);
    font-weight: 600;
    font-size: $text-sm;
  }

  &__done {
    @include flex(column, center, flex-start, 0.9rem);
    text-align: center;
    padding: 2.5rem 1rem;

    > i {
      font-size: 3rem;
      color: $success;
    }

    h2 {
      font-family: $font-display;
      font-weight: 400;
      font-size: 2rem;
      text-transform: uppercase;
    }
  }
}

.mode {
  flex: 1;
  padding: 0.6rem;
  border-radius: 8px;
  font-family: $font-condensed;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: $ink-muted;

  &--active {
    background: $paper;
    color: $ink;
    box-shadow: 0 1px 4px rgba($night, 0.12);
  }
}

.item {
  @include flex(row, center, space-between, 0.75rem);
  padding: 0.5rem 0;
  border-bottom: 1px solid $line;

  &__name {
    flex: 1;
    min-width: 0;
    font-weight: 600;
    font-size: $text-sm;
  }

  &__remove {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    color: $ink-muted;

    &:hover {
      background: $sand;
      color: $danger;
    }
  }
}
</style>
