<script setup lang="ts">
definePageMeta({
  titleI18n: 'legal-title',
  layout: 'landing',
})

const { t, locale } = useI18n()
import { legalContent } from '~/data/legal-content'
</script>

<template>
  <div class="max-w-4xl mx-auto py-12 px-6">
    <div class="legal-content">
      <div v-html="legalContent[locale]" />
    </div>
    <p class="text-sm text-slate-400 mt-12 border-t border-slate-200 pt-4">
      {{ t('legal-updated') }} mayo 2026
    </p>
  </div>
</template>

<style>
.legal-content h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2rem;
}
.legal-content h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}
.legal-content p {
  color: #475569;
  line-height: 1.625;
  margin-bottom: 1rem;
}
.legal-content ul {
  color: #475569;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  list-style-type: disc;
}
.legal-content li {
  margin-bottom: 0.5rem;
}
.legal-content a {
  color: #7c3aed;
  text-decoration: none;
}
.legal-content a:hover {
  text-decoration: underline;
}
.legal-content strong {
  font-weight: 600;
  color: #1e293b;
}
</style>
