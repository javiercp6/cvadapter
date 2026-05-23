<script setup lang="ts">
definePageMeta({
  titleI18n: 'footer-terms',
  layout: 'landing',
})

const { t, locale } = useI18n()
import { termsContent } from '~/data/terms-content'
</script>

<template>
  <div class="max-w-4xl mx-auto py-12 px-6">
    <div class="legal-content">
      <div v-html="termsContent[locale]" />
    </div>
    <p class="text-sm text-slate-400 mt-12 border-t border-slate-200 pt-4">
      {{ t('legal-updated') }} mayo 2026
    </p>
  </div>
</template>
