<script lang="ts" setup>
import { useCvState } from '~/data/useCvState'

const localePath = useLocalePath()
const { t, locale } = useI18n()

const props = defineProps<{
  formSettings: ReturnType<typeof useCvState>['formSettings'];
}>();

const { formSettings } = toRefs(props);
</script>
<template>
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">

        <!-- Card Top Bar Simple -->
        <div class="bg-slate-50/50 border-b border-slate-100 px-5 py-3 flex justify-between items-center">
            <LandingLogo class="h-5 w-auto" />
            <NuxtLink :to="localePath('create')"
                class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-violet-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" class="w-3.5 h-3.5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
                {{ t('edit-cv') }}
            </NuxtLink>
        </div>

        <!-- Profile Content Minimalista -->
        <div class="p-5">

            <!-- Avatar y Nombre Inline -->
            <div class="flex items-center gap-4 mb-6">
                <div
                    class="w-16 h-16 shrink-0 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-2xl overflow-hidden">
                    <img v-if="formSettings.profileImageDataUri" :src="formSettings.profileImageDataUri" alt="Profile"
                        class="w-full h-full object-cover">
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

            <!-- Datos de contacto sin fondos, alineados limpios -->
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

            <!-- Skills Minimalistas -->
            <div v-if="formSettings.jobSkills.length" class="pt-5 border-t border-slate-100">
                <h4 class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    {{ t('technical-skills') }}
                </h4>
                <div class="flex flex-wrap gap-1.5">
                    <span v-for="skill in formSettings.jobSkills.slice(0, 8)" :key="skill"
                        class="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
                        {{ skill }}
                    </span>
                    <span v-if="formSettings.jobSkills.length > 8"
                        class="px-2.5 py-1 text-slate-400 text-xs font-medium">
                        +{{ formSettings.jobSkills.length - 8 }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>