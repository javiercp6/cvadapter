<script setup lang="ts">
const CVFY_IMAGE = 'https://cvfy.xyz/CvFy-no-border.png'

const route = useRoute()
const { t, locale } = useI18n()

const href = `https://cvfy.xyz${route.path}`

definePageMeta({
  titleI18n: 'title-tag',
  layout: 'landing',
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
  <div class="w-full flex px-fl-sm gap-10">
    <div class="w-1/2 space-y-6">
      <h2 class="flex flex-wrap text-xl/normal  px-6 tracking-wide uppercase">
        <span class="title__text">
          CV Original
        </span>
      </h2>
      <div class="w-full flex justify-center">
        <div class="p-4 bg-white/10 rounded-lg shadow-lg inline-block h-96">
          <NuxtImg
            class="max-w-full max-h-full object-contain"
            alt="CV example"
            format="webp"

            src="/cv-screenshot-one-col-eliot.png"
            loading="eager"
            preload
          />
        </div>
      </div>
      <LandingLink
        to="/"
        outline
        class="w-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round"
          class="stroke-current"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
          <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
          <path d="M16 5l3 3" />
        </svg>
        <span>Editar tu CV</span>
      </LandingLink>
    </div>
    <div class="w-1/2 space-y-6">
      <h2 class="flex flex-wrap text-xl/normal  px-6 tracking-wide uppercase">
        <span class="title__text">
          CV Adaptado
        </span>
      </h2>
      <!-- <textarea id="" name="" class="flex-1 w-full rounded-lg h-96 resize-none border-gray-300" /> -->

      <div class="form__group col-span-full">
        <textarea
          class="form__control h-96  resize-none "
          placeholder="Ej: 'Haz mi CV más profesional para una posición de Ingeniero de Software Senior en una startup. Enfócate en mis habilidades de liderazgo y proyectos con React.'"
          rows="10"
        />
      </div>
      <LandingLink
        to="/"
        cta
        class="w-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-sparkles"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z" /></svg>
        <span>Crear</span>
      </LandingLink>
    </div>
  </div>
</template>

<style lang="postcss">
@import '@/assets/styles/form.postcss';
/* @media screen and (min-width: 1024px) {
  .main {
    @apply flex h-screen overflow-hidden;
  }
} */
@media screen and (min-width: 1024px) {
  .main {
    @apply flex overflow-hidden;
    height: calc(100vh - theme('spacing.24'));
  }
}
</style>
