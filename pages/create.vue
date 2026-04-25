<script setup lang="ts">
import { useCvState } from '~/data/useCvState'

definePageMeta({
  middleware: 'require-subscription',
})

const CVFY_IMAGE = 'https://cvfy.xyz/CvFy-no-border.png'

const { setUpCvSettings } = useCvState()
const route = useRoute()
const localePath = useLocalePath()
const { t, locale } = useI18n()

const isAdaptedMode = computed(() => route.query.mode === 'adapted')

const href = `https://cvfy.xyz${route.path}`

onMounted(() => {
  setUpCvSettings()
})

useHead({
  htmlAttrs: {
    lang: locale,
  },
  title: t('title-tag'),
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: 'https://cdn.ko-fi.com/cdn/kofi5.png?v=3',
    },
    {
      rel: 'canonical',
      href,
    },
  ],
  meta: [
    {
      name: 'description',
      content: t('description'),
    },
    {
      name: 'author',
      content: 'claudiabdm',
    },
    {
      property: 'og:image',
      content: CVFY_IMAGE,
    },
    {
      property: 'og:author',
      content: 'Claudia Benito',
    },
    {
      property: 'og:title',
      content: t('title-tag'),
    },
    {
      property: 'og:description',
      content: t('description'),
    },
    {
      name: 'twitter:creator',
      content: '@claudiabdm',
    },
    {
      name: 'twitter:title',
      content: t('title-tag'),
    },
    {
      name: 'twitter:url',
      content: href,
    },
    {
      name: 'twitter:description',
      content: t('description'),
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:image',
      content: CVFY_IMAGE,
    },
    {
      name: 'twitter:image:alt',
      content: t('description'),
    },
  ],
})
</script>

<template>
  <main class="font-app main">
    <div v-if="isAdaptedMode" class="adapted-banner">
      <span class="adapted-banner__text">{{ t('editing-adapted-cv') }}</span>
      <NuxtLink :to="localePath('test2')" class="adapted-banner__link">{{ t('back-to-base-cv') }}</NuxtLink>
    </div>
    <CvSettings class="basis-1/4 min-w-80" />
    <CvPreview class="basis-3/4" />
  </main>
</template>

<style lang="postcss">
@import '@/assets/styles/form.postcss';
@media screen and (min-width: 1024px) {
  .main {
    @apply flex h-screen overflow-hidden;
  }
}

.adapted-banner {
  @apply flex items-center justify-between px-6 py-2 bg-violet-50 border-b border-violet-100 text-sm;

  &__text {
    @apply text-violet-700 font-medium;
  }

  &__link {
    @apply text-violet-600 hover:text-violet-800 underline text-xs font-medium;
  }
}
</style>
