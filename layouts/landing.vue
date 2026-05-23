<script lang="ts" setup>
const CVFY_IMAGE = 'https://adaptercv.com/AdapterCV-no-border.png'

const { locale, t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const HREF = `https://adaptercv.com${route.path}`
const GITHUB = 'https://github.com/claudiabdm/cvfy'

const signOut = async () => {
  await supabase.auth.signOut()
}

useHead({
  htmlAttrs: {
    lang: locale,
  },
  title: t(String(route.meta.titleI18n)),
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
      content: HREF,
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
  <div class="font-landing bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
    <!-- Top NavBar -->
    <nav class="bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm shadow-[#191c1e]/5">
      <div class="max-w-7xl mx-auto px-6 h-20">
        <div class="grid grid-cols-3 items-center h-full">
          <!-- Logo -->
          <NuxtLink :to="localePath('/')" class="text-2xl font-black tracking-tight text-[#191c1e]">
            ADAPTERCV
          </NuxtLink>

          <!-- Nav Links (centered) -->
          <div class="hidden md:flex items-center justify-center gap-8">
            <NuxtLink :to="localePath('/')" class="text-[#191c1e] font-medium hover:text-[#5200e3] transition-colors duration-300">
              {{ $t('nav-home') }}
            </NuxtLink>
            <NuxtLink :to="localePath('/pricing')" class="text-[#191c1e] font-medium hover:text-[#5200e3] transition-colors duration-300">
              {{ $t('nav-pricing') }}
            </NuxtLink>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-4">
            <LandingLangSwitch />
            <template v-if="user">
              <NuxtLink
                :to="localePath('/create')"
                class="text-[#191c1e] font-medium hover:text-[#5200e3] transition-colors duration-300 text-sm"
              >
                Dashboard
              </NuxtLink>
              <button
                class="text-sm text-slate-500 hover:text-red-600 transition-colors duration-300"
                @click="signOut"
              >
                Sign Out
              </button>
            </template>
            <NuxtLink
              v-else
              :to="localePath('login')"
              class="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-xl font-semibold scale-95 duration-200 ease-in-out hover:scale-100 transition-all"
            >
              {{ $t('get-started') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Main Content -->
    <main>
      <slot />
    </main>
    
    <!-- Footer -->
    <footer class="bg-[#f2f4f6] py-12 px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <div class="flex flex-col gap-4">
          <div class="text-xl font-bold text-[#191c1e]">ADAPTERCV</div>
          <p class="text-slate-600 text-sm">© 2024 ADAPTERCV. {{ $t('footer-rights') }}</p>
        </div>
        <div class="flex flex-col gap-4">
          <p class="font-bold text-[#191c1e] uppercase text-xs tracking-wider">{{ $t('footer-product') }}</p>
          <NuxtLink :to="localePath('/pricing')" class="text-slate-600 text-sm hover:text-[#316bf3] transition-all opacity-80 hover:opacity-100">
            {{ $t('nav-pricing') }}
          </NuxtLink>
        </div>
        <div class="flex flex-col gap-4">
          <p class="font-bold text-[#191c1e] uppercase text-xs tracking-wider">{{ $t('footer-support') }}</p>
          <a href="https://github.com/claudiabdm/cvfy/issues" class="text-slate-600 text-sm hover:text-[#316bf3] transition-all opacity-80 hover:opacity-100" target="_blank">
            {{ $t('footer-help') }}
          </a>
        </div>
        <div class="flex flex-col gap-4">
          <p class="font-bold text-[#191c1e] uppercase text-xs tracking-wider">{{ $t('footer-legal') }}</p>
          <NuxtLink :to="localePath('/legal')" class="text-slate-600 text-sm hover:text-[#316bf3] transition-all opacity-80 hover:opacity-100">
            {{ $t('footer-legal-notice') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/privacy')" class="text-slate-600 text-sm hover:text-[#316bf3] transition-all opacity-80 hover:opacity-100">
            {{ $t('footer-privacy') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/terms')" class="text-slate-600 text-sm hover:text-[#316bf3] transition-all opacity-80 hover:opacity-100">
            {{ $t('footer-terms') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/cookies')" class="text-slate-600 text-sm hover:text-[#316bf3] transition-all opacity-80 hover:opacity-100">
            {{ $t('cookies-title') }}
          </NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
