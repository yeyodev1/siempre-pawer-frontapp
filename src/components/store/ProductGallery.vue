<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ images: string[]; name: string }>()
const active = ref(0)

watch(() => props.images, () => (active.value = 0))
</script>

<template>
  <div class="gallery">
    <div class="gallery__main">
      <img v-if="images[active]" :src="images[active]" :alt="name" />
      <i v-else class="fa-solid fa-futbol gallery__placeholder"></i>
    </div>
    <div v-if="images.length > 1" class="gallery__thumbs">
      <button
        v-for="(img, i) in images"
        :key="img"
        type="button"
        class="gallery__thumb"
        :class="{ 'gallery__thumb--active': i === active }"
        :aria-label="`Ver foto ${i + 1}`"
        @click="active = i"
      >
        <img :src="img" :alt="''" loading="lazy" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gallery {
  @include flex(column, stretch, flex-start, 0.75rem);

  &__main {
    aspect-ratio: 1;
    background: $sand;
    @include flex(row, center, center);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 6%;
      mix-blend-mode: multiply;
    }
  }

  &__placeholder {
    font-size: 6rem;
    color: $line;
  }

  &__thumbs {
    @include flex(row, center, flex-start, 0.5rem);
    overflow-x: auto;
    scrollbar-width: none;
  }

  &__thumb {
    flex: 0 0 4.5rem;
    aspect-ratio: 1;
    background: $sand;
    border: 2px solid transparent;
    @include transition(border-color);

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 8%;
      mix-blend-mode: multiply;
    }

    &--active {
      border-color: $ink;
    }
  }
}
</style>
