<script setup lang="ts">
import { useCvState } from '~/data/useCvState'

const { formSettings, setUpCvSettings, isLoading: isCvLoading } = useCvState()
const localePath = useLocalePath()
const { t, locale } = useI18n()

const jobOffer = ref('')
const resultData = ref<string | null>(null)
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
  resultData.value = null

  if (!jobOffer.value.trim()) {
    errorMessage.value = t('error-empty-offer')
    return
  }

  isLoading.value = true

  try {
    console.log('Enviando CV al backend con estos datos:', {
      cv_json: formSettings.value,
      oferta_trabajo: jobOffer.value,
    })
    const response = await $fetch('/api/adapter-cv', {
      method: 'POST',
      body: {
        cv_json: formSettings.value,
        oferta_trabajo: jobOffer.value,
      },
    })

    if (response && response.success) {
      resultData.value = JSON.stringify(response.resultado, null, 2)
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
    
    <!-- Header Minimalista -->
    <header class="text-center mb-8">
      <h1 class="text-2xl font-bold text-slate-900 tracking-tight mb-2">
        {{ t('adapt-cv-header') }}
      </h1>
      <p class="text-sm text-slate-500">
        {{ t('adapt-cv-subtitle') }}
      </p>
    </header>

    <!-- Main Layout: 2 columnas en pantallas grandes, gap reducido -->
    <main class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      
      <!-- ==========================================
           LEFT COLUMN (CV Preview Card)
           ========================================== -->
      <div class="flex flex-col">
        <!-- <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
          
          <div class="bg-slate-50/50 border-b border-slate-100 px-5 py-3 flex justify-between items-center">
            <LandingLogo class="h-5 w-auto" />
            <NuxtLink
              :to="localePath('create')"
              class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-violet-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              {{ t('edit-cv') }}
            </NuxtLink>
          </div>

          <div v-if="isCvLoading" class="py-20 flex flex-col items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mb-3"></div>
            <p class="text-xs text-slate-400 font-medium">Cargando perfil...</p>
          </div>

          <div v-else class="p-5">
            
            <div class="flex items-center gap-4 mb-6">
              <div class="w-16 h-16 shrink-0 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-2xl overflow-hidden">
                <img
                  v-if="formSettings.profileImageDataUri"
                  :src="formSettings.profileImageDataUri"
                  alt="Profile"
                  class="w-full h-full object-cover"
                >
                <span v-else class="text-slate-400">👤</span>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold text-slate-900 leading-tight">
                  {{ formSettings.name || t('first-name') }} {{ formSettings.lastName || t('last-name') }}
                </h3>
                <p class="text-violet-600 text-sm font-medium mt-0.5">
                  {{ formSettings.jobTitle || t('job-title') }}
                </p>
              </div>
            </div>

            <div class="flex flex-col gap-2.5 mb-6 text-sm text-slate-600">
              <div v-if="formSettings.email" class="flex items-center gap-2">
                <span class="text-slate-400 text-base">✉️</span>
                <span class="truncate">{{ formSettings.email }}</span>
              </div>
              <div v-if="formSettings.phoneNumber" class="flex items-center gap-2">
                <span class="text-slate-400 text-base">📱</span>
                <span>{{ formSettings.phoneNumber }}</span>
              </div>
              <div v-if="formSettings.location" class="flex items-center gap-2">
                <span class="text-slate-400 text-base">📍</span>
                <span>{{ formSettings.location }}</span>
              </div>
            </div>

            <div v-if="formSettings.jobSkills.length" class="pt-5 border-t border-slate-100">
              <h4 class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
                {{ t('technical-skills') }}
              </h4>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="skill in formSettings.jobSkills.slice(0, 8)"
                  :key="skill"
                  class="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md"
                >
                  {{ skill }}
                </span>
                <span
                  v-if="formSettings.jobSkills.length > 8"
                  class="px-2.5 py-1 text-slate-400 text-xs font-medium"
                >
                  +{{ formSettings.jobSkills.length - 8 }}
                </span>
              </div>
            </div>
          </div>
        </div> -->
        <CardCV :formSettings="formSettings" />
      </div>

      <!-- ==========================================
           RIGHT COLUMN (Action Form Minimalista)
           ========================================== -->
      <div  class="flex flex-col h-full">
        <div v-if="!resultData" class="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
          
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

          <!-- Error Message Discreto -->
          <div v-if="errorMessage" class="mb-4 px-3 py-2 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-start gap-2">
            <span class="text-sm font-medium">{{ errorMessage }}</span>
          </div>

          <!-- Submit Button Sólido y Simple -->
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
        
        <CardCV v-else :formSettings="resultData.resultado" />
        
        
       <!--  {{ resultData }}
        {{ formSettings }} -->
      </div>
    </main>
  </div>
</template>