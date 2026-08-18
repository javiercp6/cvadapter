<script lang="ts" setup>

const ADAPTERCV_IMAGE = 'https://adaptercv.com/AdapterCV-no-border.png'

const { locale, t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const HREF = `https://adaptercv.com${route.path}`

const isMenuOpen = ref(false)

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
      content: 'javiercp6',
    },
    {
      property: 'og:image',
      content: ADAPTERCV_IMAGE,
    },
    {
      property: 'og:author',
      content: 'Javier Ceballo Pérez',
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
      content: '@javiercp6',
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
      content: ADAPTERCV_IMAGE,
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
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-20">
        <!-- Desktop -->
        <div class="hidden md:grid grid-cols-3 items-center h-full">
          <!-- <NuxtLink :to="localePath('/')" class="text-2xl font-black tracking-tight text-[#191c1e]">
            ADAPTERCV
          </NuxtLink> -->
          <LandingLogo/>
          <div class="flex items-center justify-center gap-8">
            <NuxtLink :to="localePath('/')" class="text-[#191c1e] font-medium hover:text-[#5200e3] transition-colors duration-300">
              {{ $t('nav-home') }}
            </NuxtLink>
            <NuxtLink :to="localePath('/pricing')" class="text-[#191c1e] font-medium hover:text-[#5200e3] transition-colors duration-300">
              {{ $t('nav-pricing') }}
            </NuxtLink>
          </div>
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

        <!-- Mobile -->
        <div class="flex md:hidden justify-between items-center h-full">
          <!-- <NuxtLink :to="localePath('/')" class="text-2xl font-black tracking-tight text-[#191c1e]">
            ADAPTERCV
          </NuxtLink> -->
          <LandingLogo/>
          <button
            class="p-2 rounded-lg text-[#191c1e] hover:bg-slate-100 transition-colors duration-200"
            @click="isMenuOpen = !isMenuOpen"
            aria-label="Toggle menu"
          >
            <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div v-if="isMenuOpen" class="md:hidden bg-white border-t border-slate-200 shadow-lg px-4 pb-6 pt-4 space-y-4">
          <NuxtLink
            :to="localePath('/')"
            class="block text-[#191c1e] font-medium hover:text-[#5200e3] transition-colors duration-300"
            @click="isMenuOpen = false"
          >
            {{ $t('nav-home') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/pricing')"
            class="block text-[#191c1e] font-medium hover:text-[#5200e3] transition-colors duration-300"
            @click="isMenuOpen = false"
          >
            {{ $t('nav-pricing') }}
          </NuxtLink>
          <hr class="border-slate-200">
          <div class="flex items-center gap-4">
            <LandingLangSwitch />
          </div>
          <template v-if="user">
            <NuxtLink
              :to="localePath('/create')"
              class="block w-full text-center bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-xl font-semibold"
              @click="isMenuOpen = false"
            >
              Dashboard
            </NuxtLink>
            <button
              class="block w-full text-center text-slate-500 hover:text-red-600 transition-colors duration-300 py-2"
              @click="signOut; isMenuOpen = false"
            >
              Sign Out
            </button>
          </template>
          <NuxtLink
            v-else
            :to="localePath('login')"
            class="block w-full text-center bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-xl font-semibold"
            @click="isMenuOpen = false"
          >
            {{ $t('get-started') }}
          </NuxtLink>
        </div>
      </transition>
    </nav>
    
    <!-- Main Content -->
    <main>
      <slot />
    </main>
    
    <!-- Footer -->
    <footer class="bg-[#f2f4f6] py-12 px-4 sm:px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <div class="flex flex-col gap-4">
          <div class="text-xl font-bold text-[#191c1e]">ADAPTERCV</div>
          <p class="text-slate-600 text-sm">© {{ new Date().getFullYear() }} ADAPTERCV.</p>
        </div>
        <div class="flex flex-col gap-4">
          <p class="font-bold text-[#191c1e] uppercase text-xs tracking-wider">{{ $t('footer-product') }}</p>
          <NuxtLink :to="localePath('/pricing')" class="text-slate-600 text-sm hover:text-[#316bf3] transition-all opacity-80 hover:opacity-100">
            {{ $t('nav-pricing') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/adapter')" class="text-slate-600 text-sm hover:text-[#316bf3] transition-all opacity-80 hover:opacity-100">
            {{ $t('nav-ai-adapter') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/create')" class="text-slate-600 text-sm hover:text-[#316bf3] transition-all opacity-80 hover:opacity-100">
            {{ $t('nav-cv-editor') }}
          </NuxtLink>
        </div>
        <div class="flex flex-col gap-4">
          <p class="font-bold text-[#191c1e] uppercase text-xs tracking-wider">{{ $t('footer-support') }}</p>
          <a href="mailto:javierceballo996@gmail.com" class="text-slate-600 text-sm hover:text-[#316bf3] transition-all opacity-80 hover:opacity-100">
            {{ $t('footer-contact') }}
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
