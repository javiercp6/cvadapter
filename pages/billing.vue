<script setup lang="ts">
const { t, locale } = useI18n()
const { subscription, fetchSubscription, isLoading } = useSubscription()
const { tier, limit, current, remaining, fetchUsage } = usePlanUsage()
const user = useSupabaseUser()
const supabase = useSupabaseClient()

definePageMeta({
  layout: 'app',
  middleware: 'require-auth',
})
const isLoadingPortal = ref(false)
const portalError = ref<string | null>(null)
const invoices = ref<any[]>([])
const isInvoicesLoading = ref(false)

onMounted(async () => {
  await fetchSubscription()
  await fetchUsage()
  if (subscription.value?.hasActiveSubscription) {
    await fetchInvoices()
  }
})

useHead({
  htmlAttrs: { lang: locale.value }, // ✅ Fix Bug 2: usar .value para obtener el string
  title: t('billing-title') || 'AdapterCV - Billing',
})

async function fetchInvoices() {
  isInvoicesLoading.value = true
  try {
    // ✅ Fix Bug 3: capturar el error del customer lookup (Soporta ID o SUB)
    const userId = user.value?.id || user.value?.sub
    const { data: customerData, error: customerError } = await supabase
      .from('stripe.customers')
      .select('id')
      .or(`metadata->>user_id.eq.${userId},email.eq.${user.value?.email}`)
      .maybeSingle() // ✅ Fix Bug 3: maybeSingle() es más seguro que single()

    if (customerError) {
      console.error('Customer lookup failed:', customerError)
      invoices.value = []
      return
    }

    if (!customerData) {
      invoices.value = []
      return
    }

    const { data, error } = await supabase
      .from('stripe.invoices')
      .select('*')
      .eq('customer', customerData.id)
      .order('created', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Failed to fetch invoices:', error)
      return
    }

    if (data) {
      invoices.value = data
    }
  } catch (e) {
    console.error('Failed to fetch invoices:', e)
  } finally {
    isInvoicesLoading.value = false
  }
}

async function openCustomerPortal() {
  isLoadingPortal.value = true
  portalError.value = null

  try {
    const response = await $fetch('/api/portal', { method: 'POST' })
    if (response.url) {
      window.location.href = response.url
    }
  } catch (e: any) {
    portalError.value = e.data?.message || 'Failed to open billing portal'
  } finally {
    isLoadingPortal.value = false
  }
}

// ✅ Fix Bug 1: manejar correctamente amount === 0
const formatPrice = (amount: number | null | undefined, currency: string | null) => {
  if (amount === null || amount === undefined || !currency) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount / 100)
}

const formatDate = (timestamp: number | null) => {
  if (!timestamp) return '—'
  return new Date(timestamp * 1000).toLocaleDateString()
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-12">
    <div class="max-w-3xl mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-slate-900">
          {{ t('billing-title') || 'Billing & Subscription' }}
        </h1>
        <p class="text-slate-500 mt-1">
          {{ t('billing-subtitle') || 'Manage your plan and payment details.' }}
        </p>
      </div>

      <!-- Error -->
      <div v-if="portalError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {{ portalError }}
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>

      <template v-else>
        <!-- Current Plan Card -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 class="text-lg font-semibold text-slate-900 mb-4">
            {{ t('current-plan') || 'Current Plan' }}
          </h2>

          <div v-if="subscription?.hasActiveSubscription" class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-2xl font-bold text-slate-900">{{ subscription.productName || '—' }}</p>
                <p class="text-sm text-slate-500 mt-1">
                  <template v-if="subscription.currentPeriodEnd">
                    {{ subscription.cancelAtPeriodEnd ? (t('cancels-on') || 'Cancels on:') : (t('renews-on') || 'Renews on:') }}
                    {{ new Date(subscription.currentPeriodEnd).toLocaleDateString() }}
                  </template>
                  <template v-else>
                    {{ subscription.status }}
                  </template>
                </p>
              </div>
              <span class="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                {{ subscription.status }}
              </span>
            </div>
          </div>

          <div v-else class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-2xl font-bold text-slate-900">{{ t('plan-free-name') || 'Free' }}</p>
                <p class="text-sm text-slate-500 mt-1">
                  {{ t('plan-free-desc') || 'Perfecto para empezar' }}
                </p>
              </div>
              <span class="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full">
                {{ t('active') || 'Active' }}
              </span>
            </div>
            <NuxtLink
              to="/pricing"
              class="inline-flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">
              {{ t('upgrade-cta') || 'Upgrade Plan' }}
            </NuxtLink>
          </div>

          <!-- Usage Counter (visible for all plans) -->
          <div class="mt-6 pt-6 border-t border-slate-100">
            <p class="text-sm font-medium text-slate-700 mb-2">
              {{ t('adaptations-usage-title') || 'AI Adaptations this month' }}
            </p>
            <div class="flex items-center gap-3">
              <div class="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-300"
                  :class="remaining > 0 ? 'bg-violet-500' : 'bg-red-500'"
                  :style="{ width: `${Math.min(100, (current / limit) * 100)}%` }"
                />
              </div>
              <span class="text-sm font-medium text-slate-600 whitespace-nowrap">
                {{ current }} / {{ limit }}
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-1">
              {{ t('usage-remaining', { current, limit }) || `${current} of ${limit} used` }}
            </p>
          </div>
        </div>

        <!-- Customer Portal + Invoices (only for paid plans) -->
        <template v-if="subscription?.hasActiveSubscription">
          <!-- Customer Portal Button -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 class="text-lg font-semibold text-slate-900 mb-2">
              {{ t('manage-billing') || 'Manage Billing' }}
            </h2>
            <p class="text-sm text-slate-500 mb-4">
              {{ t('manage-billing-desc') || 'Update payment method, change plan, or cancel subscription.' }}
            </p>
            <button
              class="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              :disabled="isLoadingPortal"
              @click="openCustomerPortal">
              <svg v-if="isLoadingPortal" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {{ t('open-billing-portal') || 'Open Billing Portal' }}
            </button>
          </div>

          <!-- Invoices -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 class="text-lg font-semibold text-slate-900 mb-4">
              {{ t('recent-invoices') || 'Recent Invoices' }}
            </h2>

            <div v-if="isInvoicesLoading" class="py-8 text-center">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-400 mx-auto"></div>
            </div>

            <div v-else-if="invoices.length === 0" class="py-8 text-center text-slate-500 text-sm">
              {{ t('no-invoices') || 'No invoices yet.' }}
            </div>

            <div v-else class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-slate-200">
                    <th class="text-left py-3 px-2 font-medium text-slate-500">{{ t('date') || 'Date' }}</th>
                    <th class="text-left py-3 px-2 font-medium text-slate-500">{{ t('amount') || 'Amount' }}</th>
                    <th class="text-left py-3 px-2 font-medium text-slate-500">{{ t('status') || 'Status' }}</th>
                    <th class="text-right py-3 px-2 font-medium text-slate-500"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="invoice in invoices" :key="invoice.id" class="border-b border-slate-100 last:border-0">
                    <td class="py-3 px-2">{{ formatDate(invoice.created) }}</td>
                    <td class="py-3 px-2">{{ formatPrice(invoice.amount_due, invoice.currency) }}</td>
                    <td class="py-3 px-2">
                      <span class="px-2 py-0.5 rounded text-xs font-medium"
                            :class="invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                        {{ invoice.status }}
                      </span>
                    </td>
                    <td class="py-3 px-2 text-right">
                      <a v-if="invoice.hosted_invoice_url" :href="invoice.hosted_invoice_url" target="_blank"
                         class="text-violet-600 hover:underline text-xs">
                        {{ t('view') || 'View' }}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>