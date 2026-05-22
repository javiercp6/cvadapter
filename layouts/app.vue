<script lang="ts" setup>
const { t, locale } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const { subscription, fetchSubscription } = useSubscription()

const hamburgerOpen = ref(false)
const userMenuOpen = ref(false)
const isBillingLoading = ref(false)

onMounted(() => {
  if (user.value) {
    fetchSubscription()
  }
})

const signOut = async () => {
  await supabase.auth.signOut()
  navigateTo('/')
}

const openBillingPortal = async () => {
  isBillingLoading.value = true
  try {
    const response = await $fetch('/api/portal', { method: 'POST' })
    if (response.url) {
      window.location.href = response.url
    }
  }
  catch (e: any) {
    console.error('Billing portal error:', e)
  }
  finally {
    isBillingLoading.value = false
  }
}

const closeMenus = () => {
  hamburgerOpen.value = false
  userMenuOpen.value = false
}

useHead({
  htmlAttrs: {
    lang: locale,
  },
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800" @click="closeMenus">
    <!-- Top Bar -->
    <nav class="bg-white shadow-sm sticky top-0 z-50 h-12">
      <div class="flex items-center h-full px-4 relative">
        <!-- Left: Hamburger + Logo -->
        <div class="flex items-center gap-3">
          <!-- Hamburger (mobile only) -->
          <button
            class="lg:hidden p-1.5 rounded-md hover:bg-slate-100 transition-colors"
            @click.stop="hamburgerOpen = !hamburgerOpen"
          >
            <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <!-- Logo -->
          <NuxtLink :to="localePath('/')" class="text-lg font-bold text-slate-900 tracking-tight">
            CVFY
          </NuxtLink>
        </div>

        <!-- Center: Navigation Links -->
        <div class="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-6">
          <NuxtLink
            :to="localePath('/create')"
            active-class="text-violet-600 font-semibold border-b-2 border-violet-600 pb-0.5"
            class="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            {{ $t('nav-cv-editor') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/test2')"
            active-class="text-violet-600 font-semibold border-b-2 border-violet-600 pb-0.5"
            class="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            {{ $t('nav-ai-adapter') }}
          </NuxtLink>
        </div>

        <!-- Right: LangSwitch + User Menu -->
        <div class="flex items-center gap-4 ml-auto">
          <LandingLangSwitch />
          <div class="relative">
            <button
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              @click.stop="userMenuOpen = !userMenuOpen"
            >
              <div class="w-7 h-7 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-semibold">
                {{ user?.email?.charAt(0).toUpperCase() }}
              </div>
              <span class="hidden sm:inline text-sm text-slate-700 max-w-[120px] truncate">
                {{ user?.email }}
              </span>
              <svg class="w-4 h-4 text-slate-400" :class="{ 'rotate-180': userMenuOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
  
            <!-- User Menu Dropdown -->
            <div
              v-if="userMenuOpen"
              class="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50"
            >
              <!-- User Info -->
              <div class="px-4 py-2 border-b border-slate-100">
                <p class="text-sm font-medium text-slate-900 truncate">
                  {{ user?.email }}
                </p>
              </div>
  
              <!-- Menu Items -->
              <NuxtLink
                :to="localePath('/billing')"
                class="flex items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                @click="closeMenus"
              >
                <span>{{ $t('app-my-plan') }}</span>
                <span v-if="subscription?.productName" class="text-xs text-violet-600 font-medium">
                  {{ subscription.productName }}
                </span>
              </NuxtLink>
  
              <button
                class="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isBillingLoading || !subscription?.hasActiveSubscription"
                @click.stop="openBillingPortal"
              >
                <span>{{ $t('app-billing') }}</span>
                <svg v-if="isBillingLoading" class="animate-spin h-3.5 w-3.5 ml-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </button>
  
              <NuxtLink
                :to="localePath('/password/reset')"
                class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                @click="closeMenus"
              >
                <span>{{ $t('app-change-password') }}</span>
              </NuxtLink>
  
              <div class="border-t border-slate-100 my-1" />
  
              <button
                class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                @click.stop="signOut"
              >
                <span>{{ $t('app-sign-out') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Hamburger Dropdown (mobile) -->
      <div
        v-if="hamburgerOpen"
        class="lg:hidden absolute left-4 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50"
      >
        <!-- Navigation Links (mobile) -->
        <NuxtLink
          :to="localePath('/create')"
          class="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          active-class="text-violet-600 font-medium bg-violet-50"
          @click="closeMenus"
        >
          <span>{{ $t('nav-cv-editor') }}</span>
        </NuxtLink>
        <NuxtLink
          :to="localePath('/test2')"
          class="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          active-class="text-violet-600 font-medium bg-violet-50"
          @click="closeMenus"
        >
          <span>{{ $t('nav-ai-adapter') }}</span>
        </NuxtLink>

        <div class="border-t border-slate-100 my-1" />

        <!-- Language Switcher (mobile) -->
        <div class="px-4 py-2">
          <LandingLangSwitch />
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <slot />
    </main>
  </div>
</template>
