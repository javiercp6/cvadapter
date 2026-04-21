# Plan: Autenticacion Completa Nuxt + Supabase

## Paso 1: Configurar `supabase.redirectOptions` en `nuxt.config.ts`

Agregar bloque `supabase` antes de `build`:

```ts
supabase: {
  redirectOptions: {
    login: '/login',
    callback: '/confirm',
    exclude: ['/', '/pricing', '/login', '/confirm', '/password/**'],
    saveRedirectToCookie: true,
  },
},
```

**Nota sobre i18n**: El modulo redirige usando la ruta sin prefijo de idioma. Las rutas con prefijo (`/es/create`, `/fr/billing`) son manejadas por el router de Nuxt, y el middleware del modulo deberia funcionar correctamente porque evalua la ruta despues de resolver el alias i18n. Si hay problemas, se pueden agregar los patrones de idioma al exclude: `/es/**`, `/fr/**`, etc. **Probar primero sin ellos.**

---

## Paso 2: Crear `pages/confirm.vue`

Nuevo archivo. Maneja el callback PKCE de OAuth y confirmacion de email.

```vue
<script setup lang="ts">
const user = useSupabaseUser()
const redirectInfo = useSupabaseCookieRedirect()

watch(user, () => {
  if (user.value) {
    const path = redirectInfo.pluck()
    return navigateTo(path || '/')
  }
}, { immediate: true })
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white rounded-xl shadow-lg p-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
      <p class="text-slate-600">Confirming your login...</p>
    </div>
  </div>
</template>
```

---

## Paso 3: Actualizar `pages/login.vue`

Cambios:
1. Cambiar `emailRedirectTo` de `/login` a `/confirm`
2. Cambiar `redirectTo` de Google OAuth de `/login` a `/confirm`
3. Agregar redireccion post-login usando `useSupabaseCookieRedirect` o query param `?redirect=`
4. Agregar link "Forgot password?" que navega a `/password/reset`
5. Si el usuario ya esta autenticado, redirigir a `/` o a la ruta guardada

```vue
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

      <button
        v-if="user"
        class="w-full mb-4 py-2 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-sm font-medium transition-colors"
        @click="signOut"
      >
        Sign Out
      </button>

      <div v-if="!user" class="space-y-4">
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
          <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
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
```

---

## Paso 4: Crear `pages/password/reset.vue` y `pages/password/update.vue`

### `pages/password/reset.vue`

```vue
<script setup lang="ts">
const supabase = useSupabaseClient()
const email = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

const handleReset = async () => {
  error.value = null
  success.value = null
  loading.value = true

  if (!email.value) {
    error.value = 'Please enter your email'
    loading.value = false
    return
  }

  try {
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/password/update`,
    })
    if (resetError) throw resetError
    success.value = 'Password reset email sent! Check your inbox.'
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
      <h1 class="text-2xl font-bold text-center text-slate-900 mb-2">Reset Password</h1>
      <p class="text-sm text-slate-500 text-center mb-6">
        Enter your email and we'll send you a link to reset your password.
      </p>

      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {{ error }}
      </div>

      <div v-if="success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
        {{ success }}
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none"
            @keyup.enter="handleReset"
          />
        </div>

        <button
          class="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium transition-colors"
          :disabled="loading"
          @click="handleReset"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Send Reset Link
        </button>

        <NuxtLink to="/login" class="block text-center text-sm text-violet-600 hover:underline">
          Back to login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
```

### `pages/password/update.vue`

```vue
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
          class="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium transition-colors"
          :disabled="loading"
          @click="handleUpdate"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
```

**Importante**: Agregar `/password/**` al `exclude` en `redirectOptions` (ya incluido en Paso 1).

---

## Paso 5: Aplicar middleware `require-subscription` a `/create` y `/billing`

### En `pages/create.vue`, agregar al inicio del `<script setup>`:

```ts
definePageMeta({
  middleware: 'require-subscription',
})
```

### En `pages/billing.vue`:

1. Agregar `definePageMeta({ middleware: 'require-subscription' })`
2. Eliminar el guard manual `onMounted` que redirige a login (lineas 12-16), ya que el middleware lo maneja.

El archivo queda asi:

```ts
<script setup lang="ts">
const { t, locale } = useI18n()
const { subscription, fetchSubscription, isLoading } = useSubscription()
const user = useSupabaseUser()
const supabase = useSupabaseClient()

definePageMeta({
  middleware: 'require-subscription',
})

const isLoadingPortal = ref(false)
const portalError = ref<string | null>(null)
const invoices = ref<any[]>([])
const isInvoicesLoading = ref(false)

onMounted(async () => {
  await fetchSubscription()
  await fetchInvoices()
})

// ... resto del componente sin cambios
</script>
```

---

## Paso 6: Proteger `/api/adapter-cv` con `serverSupabaseUser`

Reemplazar el contenido de `server/api/adapter-cv.post.ts`:

```ts
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { cv_json, oferta_trabajo } = body

  if (!cv_json || !oferta_trabajo) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan datos' })
  }

  const env = event.context.cloudflare?.env

  if (!env || !env.AI) {
    throw createError({ statusCode: 500, statusMessage: 'El entorno de IA no esta disponible' })
  }

  const systemPrompt = `Eres un Executive Recruiter de elite y un experto en optimizacion de sistemas ATS (Applicant Tracking Systems). 
Tu objetivo es tomar un CV base (en formato JSON) y reescribirlo para que haga "match" perfecto con una Oferta de Trabajo, maximizando las posibilidades de contratacion.

REGLAS ESTRICTAS DE REDACCION:
1. TONO PROFESIONAL: Usa un tono corporativo, persuasivo y orientado a resultados. Inicia las vinetas de experiencia con verbos de accion fuertes (ej. Desarrollo, Lidero, Optimizo, Diseno).
2. FIDELIDAD ABSOLUTA (CERO ALUCINACIONES): TIENES ESTRICTAMENTE PROHIBIDO inventar habilidades, anos de experiencia, herramientas, idiomas o titulos academicos que no existan en el CV original. 
3. REALCE ESTRATEGICO: Si el candidato tiene una habilidad que se menciona en la oferta de trabajo, muevela hacia arriba, dale mas visibilidad y reescribe la experiencia para que conecte directamente con las necesidades de la empresa.
4. FORMATO INQUEBRANTABLE: Debes devolver UNICA Y EXCLUSIVAMENTE un objeto JSON valido con la misma estructura que el original. No incluyas saludos, ni bloques de markdown (\\\`\\\`\\\`json), solo el objeto puro.`

  const messages = [
    {
      role: "system",
      content: systemPrompt
    },
    {
      role: "user",
      content: `--- OFERTA DE TRABAJO ---\n${oferta_trabajo}\n\n--- CV DEL CANDIDATO (JSON BASE) ---\n${JSON.stringify(cv_json)}`
    }
  ]

  const MODEL_ID = '@cf/openai/gpt-oss-120b'

  try {
    const aiResponse = await env.AI.run(MODEL_ID, {
      messages: messages,
      max_tokens: 2500
    })

    let textoIA = ""

    if (typeof aiResponse === 'string') {
      textoIA = aiResponse
    } else if (aiResponse?.response) {
      textoIA = aiResponse.response
    } else if (aiResponse?.choices?.[0]?.message) {
      const msg = aiResponse.choices[0].message
      textoIA = msg.content || msg.reasoning_content || ""
    } else {
      throw new Error(`Estructura de respuesta desconocida: ${JSON.stringify(aiResponse)}`)
    }

    const inicio = textoIA.indexOf('{')
    const fin = textoIA.lastIndexOf('}')
    
    if (inicio !== -1 && fin !== -1) {
      const jsonLimpio = textoIA.substring(inicio, fin + 1)
      return { 
        success: true, 
        resultado: JSON.parse(jsonLimpio) 
      }
    } else {
      throw new Error(`La IA no devolvio JSON valido. Respuesta: ${textoIA}`)
    }

  } catch (error: any) {
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Error de IA: ${error.message}` 
    })
  }
})
```

---

## Paso 7: Refactorizar `checkout.post.ts` y `portal.post.ts` con `serverSupabaseUser`

### `server/api/checkout.post.ts`

Reemplazar todo el bloque de creacion manual del cliente SSR con `serverSupabaseUser`:

```ts
import Stripe from 'stripe'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { priceId } = body

  if (!priceId) {
    throw createError({ statusCode: 400, message: 'priceId is required' })
  }

  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const stripeKey = useRuntimeConfig(event).stripeSecretKey as string
  const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' })

  const existingCustomers = await stripe.customers.list({ email: user.email!, limit: 1 })

  let customerId: string
  if (existingCustomers.data.length > 0) {
    customerId = existingCustomers.data[0].id
  } else {
    const customer = await stripe.customers.create({
      email: user.email!,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${useRuntimeConfig(event).public.siteUrl}/billing?success=true`,
    cancel_url: `${useRuntimeConfig(event).public.siteUrl}/pricing?canceled=true`,
    metadata: { supabase_user_id: user.id },
  })

  return { sessionId: session.id, url: session.url }
})
```

### `server/api/portal.post.ts`

```ts
import Stripe from 'stripe'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const stripeKey = useRuntimeConfig(event).stripeSecretKey as string
  const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' })

  const customers = await stripe.customers.list({ email: user.email!, limit: 1 })

  if (customers.data.length === 0) {
    throw createError({ statusCode: 404, message: 'No Stripe customer found' })
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customers.data[0].id,
    return_url: `${useRuntimeConfig(event).public.siteUrl}/billing`,
  })

  return { url: portalSession.url }
})
```

---

## Paso 8: Agregar logout y estado de sesion en layout/nav

Modificar `layouts/landing.vue` para mostrar el estado del usuario en el nav:

Reemplazar el bloque de Actions (lineas 94-102):

```vue
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
      class="text-sm text-slate-500 hover:text-red-600 transition-colors"
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
```

Agregar al `<script setup>`:

```ts
const user = useSupabaseUser()
const supabase = useSupabaseClient()

const signOut = async () => {
  await supabase.auth.signOut()
}
```

---

## Verificacion post-implementacion

1. `npm run build` o `npm run dev` para verificar que compila
2. Probar flujo: anonimo visita `/` -> no redirige
3. Probar flujo: anonimo visita `/create` -> redirige a `/login` -> login -> redirige a `/create`
4. Probar flujo: signup con email -> recibir confirmacion -> click link -> `/confirm` -> redirect
5. Probar flujo: Google OAuth -> callback a `/confirm` -> redirect
6. Probar flujo: forgot password -> email -> click link -> `/password/update` -> cambiar password
7. Probar flujo: llamar `/api/adapter-cv` sin auth -> 401
8. Probar flujo: logout desde nav -> session limpia

## Supabase Dashboard: configurar

- Agregar `http://localhost:3000/confirm` y `https://www.cvfy.xyz/confirm` a **Authentication -> URL Configuration -> Redirect URLs**
- Agregar `http://localhost:3000/password/update` y `https://www.cvfy.xyz/password/update` a Redirect URLs
- Verificar que Google OAuth provider esta activado en **Authentication -> Providers**
