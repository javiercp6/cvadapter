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
  <div class="saas-container">
    <header class="header">
      <h1>{{ t('adapt-cv-header') }}</h1>
      <p>{{ t('adapt-cv-subtitle') }}</p>
    </header>

    <main class="grid-layout">
      <div class="left-column">
        <div class="cv-card">
          <div class="cv-card__header">
            <LandingLogo />
            <NuxtLink
              :to="localePath('create')"
              class="cv-card__edit-btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              {{ t('edit-cv') }}
            </NuxtLink>
          </div>

          <div v-if="isCvLoading" class="cv-card__loading">
            <div class="pulse" />
          </div>

          <div v-else class="cv-card__content">
            <div class="cv-card__profile">
              <div
                v-if="formSettings.profileImageDataUri"
                class="cv-card__avatar"
              >
                <img
                  :src="formSettings.profileImageDataUri"
                  alt="Profile"
                >
              </div>
              <div
                v-else
                class="cv-card__avatar cv-card__avatar--placeholder"
              >
                👤
              </div>
              <div class="cv-card__info">
                <h3 class="cv-card__name">
                  {{ formSettings.name || t('first-name') }} {{ formSettings.lastName || t('last-name') }}
                </h3>
                <p class="cv-card__title">
                  {{ formSettings.jobTitle || t('job-title') }}
                </p>
              </div>
            </div>

            <div class="cv-card__details">
              <div v-if="formSettings.email" class="cv-card__detail">
                <span class="cv-card__icon">✉️</span>
                <span>{{ formSettings.email }}</span>
              </div>
              <div v-if="formSettings.phoneNumber" class="cv-card__detail">
                <span class="cv-card__icon">📱</span>
                <span>{{ formSettings.phoneNumber }}</span>
              </div>
              <div v-if="formSettings.location" class="cv-card__detail">
                <span class="cv-card__icon">📍</span>
                <span>{{ formSettings.location }}</span>
              </div>
            </div>

            <div v-if="formSettings.jobSkills.length" class="cv-card__section">
              <h4 class="cv-card__section-title">
                {{ t('technical-skills') }}
              </h4>
              <div class="cv-card__tags">
                <span
                  v-for="skill in formSettings.jobSkills.slice(0, 8)"
                  :key="skill"
                  class="cv-card__tag"
                >
                  {{ skill }}
                </span>
                <span
                  v-if="formSettings.jobSkills.length > 8"
                  class="cv-card__tag cv-card__tag--more"
                >
                  +{{ formSettings.jobSkills.length - 8 }}
                </span>
              </div>
            </div>

            <div v-if="formSettings.softSkills.length" class="cv-card__section">
              <h4 class="cv-card__section-title">
                {{ t('soft-skills') }}
              </h4>
              <div class="cv-card__tags">
                <span
                  v-for="skill in formSettings.softSkills.slice(0, 6)"
                  :key="skill"
                  class="cv-card__tag cv-card__tag--soft"
                >
                  {{ skill }}
                </span>
              </div>
            </div>

            <div v-if="formSettings.work.length" class="cv-card__section">
              <h4 class="cv-card__section-title">
                {{ t('experience') }}
              </h4>
              <div
                v-for="work in formSettings.work.slice(0, 2)"
                :key="work.id"
                class="cv-card__experience"
              >
                <p class="cv-card__exp-title">
                  {{ work.title }}
                </p>
                <p class="cv-card__exp-company">
                  {{ work.location }}
                </p>
              </div>
            </div>

            <div v-if="formSettings.education.length" class="cv-card__section">
              <h4 class="cv-card__section-title">
                {{ t('education') }}
              </h4>
              <div
                v-for="edu in formSettings.education.slice(0, 1)"
                :key="edu.id"
                class="cv-card__experience"
              >
                <p class="cv-card__exp-title">
                  {{ edu.title }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-column">
        <div class="form-group">
          <label>{{ t('job-offer-label') }}</label>
          <p class="form-hint">
            {{ t('job-offer-hint') }}
          </p>
          <textarea
            v-model="jobOffer"
            rows="8"
            class="job-input"
            :placeholder="t('job-offer-placeholder')"
          />
        </div>

        <button
          class="btn-primary"
          :disabled="isLoading"
          @click="procesarCV"
        >
          <span v-if="isLoading">✨ {{ t('adapting') }}</span>
          <span v-else>⚡ {{ t('adapt-button') }}</span>
        </button>

        <div v-if="errorMessage" class="error-box">
          ❌ {{ errorMessage }}
        </div>

        <div class="output-section">
          <label>{{ t('adapted-result') }}</label>

          <div v-if="isLoading" class="loading-state">
            <div class="pulse" />
            <p>{{ t('ai-thinking') }}</p>
          </div>

          <pre
            v-else-if="resultData"
            class="result-box"
          >{{ resultData }}</pre>

          <div
            v-else
            class="empty-state"
          >
            <p>{{ t('waiting-result') }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.saas-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
  color: #333;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #111;
}

.header p {
  color: #666;
  font-size: 1.1rem;
}

.grid-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.cv-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.cv-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.cv-card__edit-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #5B21B6;
  color: white;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s;
}

.cv-card__edit-btn:hover {
  background: #4C1D95;
}

.cv-card__content {
  padding: 1.5rem;
}

.cv-card__profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.cv-card__avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  background: #f1f5f9;
}

.cv-card__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cv-card__avatar--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.cv-card__info {
  flex: 1;
}

.cv-card__name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.cv-card__title {
  color: #64748b;
  font-size: 0.95rem;
}

.cv-card__details {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cv-card__detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #475569;
  font-size: 0.9rem;
}

.cv-card__icon {
  font-size: 0.9rem;
}

.cv-card__section {
  margin-bottom: 1.25rem;
}

.cv-card__section-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.cv-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.cv-card__tag {
  padding: 0.25rem 0.75rem;
  background: #f1f5f9;
  border-radius: 9999px;
  font-size: 0.8rem;
  color: #475569;
}

.cv-card__tag--soft {
  background: #ede9fe;
  color: #5b21b6;
}

.cv-card__tag--more {
  background: transparent;
  color: #64748b;
}

.cv-card__experience {
  margin-bottom: 0.75rem;
}

.cv-card__exp-title {
  font-weight: 600;
  color: #334155;
  font-size: 0.95rem;
}

.cv-card__exp-company {
  color: #64748b;
  font-size: 0.85rem;
}

.cv-card__loading {
  padding: 3rem;
  display: flex;
  justify-content: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #444;
}

.form-hint {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.job-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  resize: vertical;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.job-input:focus {
  outline: none;
  border-color: #5B21B6;
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  background-color: #5B21B6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #4C1D95;
}

.btn-primary:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

.error-box {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 8px;
  border: 1px solid #f87171;
}

.output-section {
  margin-top: 1.5rem;
}

.output-section label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #444;
}

.result-box {
  background-color: #1e1e1e;
  color: #d4d4d4;
  padding: 1.5rem;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.8rem;
  overflow-x: auto;
  max-height: 500px;
  white-space: pre-wrap;
}

.empty-state {
  background-color: #f3f4f6;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #6b7280;
}

.loading-state {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #475569;
  text-align: center;
  padding: 2rem;
}

.pulse {
  width: 40px;
  height: 40px;
  background-color: #5B21B6;
  border-radius: 50%;
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
  margin-bottom: 1rem;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

@media (max-width: 1024px) {
  .grid-layout {
    grid-template-columns: 1fr;
  }
}
</style>
