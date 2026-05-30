<script setup lang="ts">
import { useCvState } from '~/data/useCvState'

definePageMeta({
  layout: 'app',
  middleware: 'require-auth',
})

const CVFY_IMAGE = 'https://adaptercv.com/AdapterCV-no-border.png'

const { setUpCvSettings } = useCvState()
const route = useRoute()
const localePath = useLocalePath()
const { t, locale } = useI18n()

const isAdaptedMode = computed(() => route.query.mode === 'adapted')

const href = `https://adaptercv.com${route.path}`

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
  <div class="flex flex-col h-screen overflow-hidden">
    <!-- ⚡ BANNER DE MODO ADAPTADO (Ancho completo, oculto al imprimir) -->
    <div
      v-if="isAdaptedMode"
      class="bg-violet-600 text-white px-6 py-2.5 flex items-center justify-between text-sm font-medium z-50 print:hidden shadow-md shrink-0"
    >
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-violet-200 animate-pulse shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span>
          {{ t('editing-adapted-cv-banner') || 'Estás editando la versión adaptada de tu CV para la oferta.' }}
        </span>
      </div>

      <div class="flex items-center gap-4 shrink-0">
        <span class="text-xs bg-violet-700 text-violet-200 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
          {{ t('adapted-badge') }}
        </span>
        <NuxtLink
          :to="localePath('/test2')"
          class="text-xs bg-white text-violet-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-violet-50 transition-colors shadow-sm"
        >
          &larr; {{ t('back-to-base-cv') || 'Volver' }}
        </NuxtLink>
      </div>
    </div>

    <!-- Contenido Principal (Ajustes + Preview) -->
    <main class="font-app main flex-1 flex h-full overflow-hidden">
      <CvSettings class="basis-1/4 min-w-80" />
      <CvPreview class="basis-3/4" />
    </main>
  </div>
</template>

<style lang="postcss">
@import '@/assets/styles/form.postcss';
@media screen and (min-width: 1024px) {
  .main {
    @apply flex h-screen overflow-hidden;
  }
}
</style>
