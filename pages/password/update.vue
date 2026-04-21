<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const newPassword = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

const handleUpdate = async () => {
  error.value = null
  success.value = null
  loading.value = true

  if (!newPassword.value || newPassword.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    loading.value = false
    return
  }

  try {
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword.value,
    })
    if (updateError) throw updateError
    success.value = 'Password updated successfully!'
    setTimeout(() => navigateTo('/'), 2000)
  } catch (e: any) {
    error.value = e.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold text-center text-slate-900 mb-2">Update Password</h1>
      <p class="text-sm text-slate-500 text-center mb-6">
        Enter your new password below.
      </p>

      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {{ error }}
      </div>

      <div v-if="success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
        {{ success }}
      </div>

      <div v-if="user" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">New Password</label>
          <input
            v-model="newPassword"
            type="password"
            placeholder="••••••••"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none"
            @keyup.enter="handleUpdate"
          />
        </div>

        <button
          class="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"
          :disabled="loading"
          @click="handleUpdate"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Update Password
        </button>
      </div>

      <div v-else class="text-center">
        <p class="text-slate-500 text-sm mb-4">This link is invalid or has expired.</p>
        <NuxtLink to="/password/reset" class="text-violet-600 hover:underline text-sm">
          Request a new reset link
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
