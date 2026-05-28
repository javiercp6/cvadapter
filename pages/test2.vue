<script setup lang="ts">
import { useCvState } from '~/data/useCvState'

const { formSettings, setUpCvSettings, isLoading: isCvLoading, saveAdaptedCv } = useCvState()

const localePath = useLocalePath()
const { t, locale } = useI18n()
const { remaining, canAdapt, fetchUsage, limit, current } = usePlanUsage()
const showLimitModal = ref(false)

const jobOffer = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

definePageMeta({
  layout: 'app',
  middleware: 'require-auth',
})

onMounted(() => {
  setUpCvSettings()
  fetchUsage()
})

// Refrescar contador al volver desde /create (SPA navigation)
onActivated(() => {
  fetchUsage()
})

useHead({
  htmlAttrs: {
    lang: locale,
  },
  title: t('adapt-cv-title'),
})

const procesarCV = async () => {
  errorMessage.value = ''
  showLimitModal.value = false

  if (!jobOffer.value.trim()) {
    errorMessage.value = t('error-empty-offer')
    return
  }

  if (!canAdapt.value) {
    showLimitModal.value = true
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
      await fetchUsage() // refrescar contador tras adaptar exitosamente
      navigateTo(localePath({ name: 'create', query: { mode: 'adapted' } }))
    }
    else {
      errorMessage.value = t('error-adapting-cv')
    }
  }
  catch (error: any) {
    if (error.statusCode === 429 || error.data?.statusMessage === 'monthly_limit_reached') {
      showLimitModal.value = true
    }
    else {
      errorMessage.value = error.data?.statusMessage || t('error-adapting-cv')
      console.error(error)
    }
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

          <!-- Usage Banner -->
          <div class="mb-4 p-3 rounded-lg border"
               :class="canAdapt ? 'bg-slate-50 border-slate-200' : 'bg-red-50 border-red-200'">
            <p class="text-sm font-medium" :class="canAdapt ? 'text-slate-700' : 'text-red-700'">
              {{ t('usage-remaining', { current, limit }) || `${current} of ${limit} used` }}
            </p>
            <p v-if="!canAdapt" class="text-xs text-red-600 mt-1">
              {{ t('limit-reached-desc') || 'You have reached your monthly limit. Upgrade to continue.' }}
            </p>
          </div>

          <!-- Limit Reached Modal/CTA -->
          <div v-if="showLimitModal" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <p class="text-sm font-semibold text-red-800 mb-2">
              {{ t('limit-reached-title') || 'Monthly limit reached' }}
            </p>
            <p class="text-xs text-red-600 mb-3">
              {{ t('limit-reached-desc') || 'You have used all your AI adaptations this month. Upgrade your plan to get more.' }}
            </p>
            <NuxtLink
              to="/pricing"
              class="inline-flex items-center px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors">
              {{ t('upgrade-cta') || 'View Plans' }}
            </NuxtLink>
          </div>

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

          <div v-if="errorMessage && !showLimitModal" class="mb-4 px-3 py-2 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-start gap-2">
            <span class="text-sm font-medium">{{ errorMessage }}</span>
          </div>

          <button
            class="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"
            :disabled="isLoading || !canAdapt"
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
