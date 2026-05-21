<script setup lang="ts">
import { useCvState } from '~/data/useCvState'

const { formSettings, setUpCvSettings, isLoading: isCvLoading, saveAdaptedCv } = useCvState()

definePageMeta({
  layout: 'app',
})
const localePath = useLocalePath()
const { t, locale } = useI18n()

const jobOffer = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

onMounted(() => {
  setUpCvSettings()
})

useHead({
  htmlAttrs: {
    lang: locale,
  },
  title: t('adapt-cv-title'),
})

const procesarCV = async () => {
  errorMessage.value = ''

  if (!jobOffer.value.trim()) {
    errorMessage.value = t('error-empty-offer')
    return
  }

  isLoading.value = true

  try {
    const response = await $fetch('/api/adapter-cv', {
      method: 'POST',
      body: {
        cv_json: { ...formSettings.value, profileImageDataUri: null },
        oferta_trabajo: jobOffer.value,
      },
    })

    if (response && response.success) {
      saveAdaptedCv(response.resultado)
      navigateTo(localePath({ name: 'create', query: { mode: 'adapted' } }))
    }
    else {
      errorMessage.value = t('error-adapting-cv')
    }
  }
  catch (error: any) {
    errorMessage.value = error.data?.statusMessage || t('error-adapting-cv')
    console.error(error)
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-8 font-sans text-slate-800">

    <header class="text-center mb-8">
      <h1 class="text-2xl font-bold text-slate-900 tracking-tight mb-2">
        {{ t('adapt-cv-header') }}
      </h1>
      <p class="text-sm text-slate-500">
        {{ t('adapt-cv-subtitle') }}
      </p>
    </header>

    <main class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

      <div class="flex flex-col">
        <CardCV :formSettings="formSettings" />
      </div>

      <div class="flex flex-col h-full">
        <div class="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">

          <div class="mb-5 flex-grow">
            <label class="block text-sm font-semibold text-slate-900 mb-1">
              {{ t('job-offer-label') }}
            </label>
            <p class="text-xs text-slate-500 mb-4">
              {{ t('job-offer-hint') }}
            </p>

            <textarea
              v-model="jobOffer"
              rows="8"
              class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-violet-500 focus:border-violet-500 focus:outline-none transition-colors resize-y"
              :placeholder="t('job-offer-placeholder')"
            />
          </div>

          <div v-if="errorMessage" class="mb-4 px-3 py-2 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-start gap-2">
            <span class="text-sm font-medium">{{ errorMessage }}</span>
          </div>

          <button
            class="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"
            :disabled="isLoading"
            @click="procesarCV"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ t('adapting') }}
            </span>
            <span v-else>
              {{ t('adapt-button') }}
            </span>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
