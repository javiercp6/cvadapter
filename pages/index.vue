<script lang="ts" setup>
const localePath = useLocalePath()
definePageMeta({
  titleI18n: 'title-tag',
  layout: 'landing',
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-20 pb-32 px-6">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div class="z-10">
          <h1 class="text-5xl md:text-7xl font-extrabold text-on-surface leading-[1.1] tracking-tight mb-8 font-headline">
            {{ $t('landing-hero-1') }} <span class="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">{{ $t('landing-hero-2') }}</span>
          </h1>
          <p class="text-lg md:text-xl text-on-surface-variant leading-relaxed mb-10 max-w-xl">
            {{ $t('landing-hero-paragraph') }}
          </p>
          <div class="flex flex-wrap gap-4">
            <NuxtLink 
              :to="localePath('login')" 
              class="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all inline-block"
            >
              {{ $t('landing-cta-start') }}
            </NuxtLink>
            <button class="bg-surface-container-highest text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-surface-container-high transition-all flex items-center gap-2">
              <span class="material-symbols-outlined">play_circle</span>
              {{ $t('landing-cta-demo') }}
            </button>
          </div>
        </div>
        <div class="relative">
          <!-- CV Transformation Visualization -->
          <div class="relative z-10 bg-surface-container-lowest rounded-xl shadow-2xl p-4 border border-outline-variant/10">
            <div class="flex items-center justify-between mb-6 pb-4 border-b border-surface-container">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-bold">Resumen_Final_V2.pdf</p>
                  <p class="text-[10px] text-on-surface-variant">{{ $t('landing-hero-optimized') }}</p>
                </div>
              </div>
              <!-- Match Meter Chip -->
              <div class="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                98% ATS Match
              </div>
            </div>
            <div class="space-y-3">
              <div class="h-4 bg-surface-container rounded-full w-3/4"></div>
              <div class="h-3 bg-surface-container-low rounded-full w-full"></div>
              <div class="h-3 bg-surface-container-low rounded-full w-5/6"></div>
              <div class="grid grid-cols-3 gap-2 py-4">
                <div class="h-20 bg-primary/10 rounded-lg flex flex-col items-center justify-center gap-2 border border-primary/20">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7h2a2 2 0 012 2v10a2 2 0 01-2 2h-2m-6-12H7a2 2 0 00-2 2v10a2 2 0 002 2h2m6-12l2 2m-2-2l-2 2m6 4h2m-2-4h2m-6 4h6" />
                  </svg>
                  <span class="text-[10px] font-bold text-primary">{{ $t('landing-hero-keywords') }}</span>
                </div>
                <div class="h-20 bg-secondary/10 rounded-lg flex flex-col items-center justify-center gap-2 border border-secondary/20">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span class="text-[10px] font-bold text-secondary">{{ $t('landing-hero-skills') }}</span>
                </div>
                <div class="h-20 bg-tertiary-container/10 rounded-lg flex flex-col items-center justify-center gap-2 border border-tertiary-container/20">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-[10px] font-bold text-tertiary">{{ $t('landing-hero-ready') }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Decorative blur backgrounds -->
          <div class="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10"></div>
          <div class="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -z-10"></div>
        </div>
      </div>
    </section>

    <!-- Problem/Solution Section -->
    <section id="features" class="bg-surface-container-low py-24 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-5xl font-extrabold mb-6 font-headline">{{ $t('landing-problem-title') }}</h2>
          <p class="text-on-surface-variant max-w-2xl mx-auto text-lg">
            {{ $t('landing-problem-paragraph') }}
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-surface-container-lowest p-10 rounded-xl flex items-start gap-6">
            <div class="bg-error-container text-error p-4 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-3 font-headline">{{ $t('landing-problem-heading') }}</h3>
              <p class="text-on-surface-variant leading-relaxed">
                {{ $t('landing-problem-text') }}
              </p>
            </div>
          </div>
          <div class="bg-surface-container-lowest p-10 rounded-xl flex items-start gap-6 border-l-4 border-primary">
            <div class="bg-primary-fixed text-primary p-4 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.854L21 12l-5.714 2.144L13 21l-2.286-6.854L5 12l5.714-2.144L13 3z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-3 font-headline">{{ $t('landing-solution-heading') }}</h3>
              <p class="text-on-surface-variant leading-relaxed">
                {{ $t('landing-solution-text') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it Works (3 Steps) -->
    <section class="py-24 px-6 bg-surface">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-20">
          <h2 class="text-3xl md:text-4xl font-extrabold mb-4 font-headline">{{ $t('landing-steps-title') }}</h2>
          <p class="text-on-surface-variant">{{ $t('landing-steps-subtitle') }}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <!-- Visual connector line hidden on mobile -->
          <div class="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5 -translate-y-1/2 -z-0"></div>
          <!-- Step 1 -->
          <div class="relative z-10 text-center">
            <div class="w-16 h-16 bg-surface-container-lowest rounded-full flex items-center justify-center text-2xl font-black text-primary mx-auto mb-6 shadow-lg border border-primary/10 font-headline">1</div>
            <h3 class="text-xl font-extrabold mb-4 font-headline">{{ $t('landing-step-1-title') }}</h3>
            <p class="text-on-surface-variant">{{ $t('landing-step-1-text') }}</p>
          </div>
          <!-- Step 2 -->
          <div class="relative z-10 text-center">
            <div class="w-16 h-16 bg-surface-container-lowest rounded-full flex items-center justify-center text-2xl font-black text-primary mx-auto mb-6 shadow-lg border border-primary/10 font-headline">2</div>
            <h3 class="text-xl font-extrabold mb-4 font-headline">{{ $t('landing-step-2-title') }}</h3>
            <p class="text-on-surface-variant">{{ $t('landing-step-2-text') }}</p>
          </div>
          <!-- Step 3 -->
          <div class="relative z-10 text-center">
            <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-black text-on-primary mx-auto mb-6 shadow-xl shadow-primary/30 font-headline">3</div>
            <h3 class="text-xl font-extrabold mb-4 font-headline">{{ $t('landing-step-3-title') }}</h3>
            <p class="text-on-surface-variant">{{ $t('landing-step-3-text') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Features Bento Grid -->
    <section class="py-24 px-6 bg-surface-container-low">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl md:text-5xl font-extrabold text-center mb-16 font-headline">{{ $t('landing-features-title') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Feature 1 -->
          <div class="md:col-span-2 bg-surface-container-lowest rounded-xl p-8 shadow-sm flex flex-col justify-between overflow-hidden relative">
            <div class="z-10">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 class="text-2xl font-bold mb-4 font-headline">{{ $t('landing-feature-1-title') }}</h3>
              <p class="text-on-surface-variant max-w-md">{{ $t('landing-feature-1-text') }}</p>
            </div>
          </div>
          <!-- Feature 2 -->
          <div class="bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl p-8 shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-white mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 class="text-2xl font-bold mb-4 font-headline">{{ $t('landing-feature-2-title') }}</h3>
            <p class="opacity-90">{{ $t('landing-feature-2-text') }}</p>
            <div class="mt-8 flex items-center gap-4">
              <div class="text-4xl font-black font-headline">94/100</div>
              <div class="h-2 bg-white/20 flex-1 rounded-full overflow-hidden">
                <div class="h-full bg-white w-[94%]"></div>
              </div>
            </div>
          </div>
          <!-- Feature 3 -->
          <div class="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-secondary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <h3 class="text-2xl font-bold mb-4 font-headline">{{ $t('landing-feature-3-title') }}</h3>
            <p class="text-on-surface-variant">{{ $t('landing-feature-3-text') }}</p>
          </div>
          <!-- Feature 4 -->
          <div class="md:col-span-2 bg-surface-container-lowest rounded-xl p-8 shadow-sm flex items-center gap-8 border-t-4 border-secondary">
            <div class="flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-secondary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h3 class="text-2xl font-bold mb-4 font-headline">{{ $t('landing-feature-4-title') }}</h3>
              <p class="text-on-surface-variant">{{ $t('landing-feature-4-text') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-24 px-6 bg-surface">
      <div class="max-w-5xl mx-auto bg-gradient-to-br from-primary-container to-tertiary rounded-3xl p-12 text-center text-on-primary relative overflow-hidden">
        <div class="absolute inset-0 opacity-10" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
        <h2 class="text-4xl md:text-5xl font-extrabold mb-6 relative z-10 font-headline">{{ $t('landing-cta-final-title') }}</h2>
        <p class="text-xl opacity-90 mb-10 max-w-2xl mx-auto relative z-10">{{ $t('landing-cta-final-text') }}</p>
        <div class="flex flex-wrap justify-center gap-4 relative z-10">
          <NuxtLink 
            :to="localePath('login')" 
            class="bg-white text-primary px-10 py-5 rounded-xl font-bold text-xl shadow-2xl hover:scale-105 transition-transform inline-block"
          >
            {{ $t('landing-cta-final-button') }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
