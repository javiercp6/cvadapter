<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)
const mode = ref<'login' | 'signup'>('login')

const redirectPath = computed(() => {
  return (route.query.redirect as string) || '/'
})

watch(user, () => {
  if (user.value) {
    return navigateTo(redirectPath.value)
  }
}, { immediate: true })

const handleAuth = async () => {
  error.value = null
  success.value = null
  loading.value = true

  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    loading.value = false
    return
  }

  try {
    if (mode.value === 'signup') {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
          emailRedirectTo: `${window.location.origin}/confirm`,
        },
      })

      if (authError) throw authError

      if (data.user) {
        success.value = 'Account created! Check your email to confirm.'
      }
    } else {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })

      if (authError) throw authError

      if (data.user) {
        return navigateTo(redirectPath.value)
      }
    }
  } catch (e: any) {
    error.value = e.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}

const signOut = async () => {
  const { error: signOutError } = await supabase.auth.signOut()
  if (signOutError) {
    error.value = signOutError.message
  }
}

const signInWithGoogle = async () => {
  error.value = null
  const { error: oauthError } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/confirm`,
    },
  })
  if (oauthError) {
    error.value = oauthError.message
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold text-center text-slate-900 mb-2">
        {{ mode === 'login' ? 'Welcome Back' : 'Create Account' }}
      </h1>

      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {{ error }}
      </div>

      <div v-if="success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
        {{ success }}
      </div>

      <button
        v-if="user"
        class="w-full mb-4 py-2 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-sm font-medium transition-colors"
        @click="signOut"
      >
        Sign Out
      </button>

      <div v-if="!user && !success" class="space-y-4">
        <button
          class="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"
          @click="signInWithGoogle"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div class="relative flex items-center">
          <div class="flex-grow border-t border-slate-300"></div>
          <span class="flex-shrink mx-4 text-slate-400 text-sm">or</span>
          <div class="flex-grow border-t border-slate-300"></div>
        </div>

        <div class="flex gap-2">
          <button
            class="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            :class="mode === 'login' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            @click="mode = 'login'"
          >
            Login
          </button>
          <button
            class="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            :class="mode === 'signup' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            @click="mode = 'signup'"
          >
            Sign Up
          </button>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none"
            @keyup.enter="handleAuth"
          />
        </div>

        <button
          class="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"
          :disabled="loading"
          @click="handleAuth"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {{ mode === 'login' ? 'Login' : 'Create Account' }}
        </button>

        <NuxtLink
          v-if="mode === 'login'"
          to="/password/reset"
          class="block text-center text-sm text-violet-600 hover:underline"
        >
          Forgot your password?
        </NuxtLink>

        <p class="text-xs text-slate-500 text-center">
          {{ mode === 'login' ? "Don't have an account?" : 'Already have an account?' }}
          <button
            class="text-violet-600 hover:underline"
            @click="mode = mode === 'login' ? 'signup' : 'login'"
          >
            {{ mode === 'login' ? 'Sign up' : 'Login' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
