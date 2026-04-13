<script setup lang="ts">
const supabase = useSupabaseClient()
const session = useSupabaseSession()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)
const mode = ref<'login' | 'signup'>('login')
const connectionStatus = ref<'checking' | 'connected' | 'error'>('checking')


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
          emailRedirectTo: `${window.location.origin}/login`,
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
        success.value = `Welcome back, ${data.user.email}!`
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
  } else {
    success.value = 'Signed out successfully'
    email.value = ''
    password.value = ''
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
      <!-- Header -->
      <h1 class="text-2xl font-bold text-center text-slate-900 mb-2">
        Supabase Auth Test
      </h1>


      <!-- Sign Out Button -->
      <button
        v-if="session"
        class="w-full mb-4 py-2 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-sm font-medium transition-colors"
        @click="signOut"
      >
        Sign Out
      </button>

      <!-- Auth Form -->
      <div v-if="!session" class="space-y-4">
        <!-- Toggle Mode -->
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

        <!-- Email Input -->
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

        <!-- Password Input -->
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

        <!-- Submit Button -->
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

        <!-- Info -->
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
