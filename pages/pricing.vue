<script setup lang="ts">
definePageMeta({
  titleI18n: 'title-tag',
  layout: 'landing',
})
const { t, locale } = useI18n()
const localePath = useLocalePath()
const user = useSupabaseUser()
const { subscription, fetchSubscription, checkout, isLoading: isSubLoading } = useSubscription()
const { plans, fetchPlans, isLoading: isPlansLoading } = usePricingPlans()

onMounted(async () => {
  if (user.value) {
    await fetchSubscription()
  }
  await fetchPlans()
})

useHead({
  htmlAttrs: { lang: locale },
  title: t('pricing-title') || 'AdapterCV - Pricing',
})

const formatPrice = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(amount / 100)
}

const allPlans = computed(() => {
  const freePlan = {
    price_id: 'free',
    stripe_price_id: null,
    currency: 'eur',
    unit_amount: 0,
    recurring: null,
    product_name: t('plan-free-name') || 'Free',
    product_description: t('plan-free-desc') || 'Perfecto para empezar',
    tier: 'free',
    price_metadata: {
      features: JSON.stringify([
        t('feature-cv-editor') || 'CV Editor',
        t('feature-2-adaptations') || '2 AI adaptations / month',
      ]),
    },
  }
  return [freePlan, ...plans.value]
})

const handleCheckout = async (priceId: string) => {
  if (!user.value) {
    navigateTo(localePath('login') + '?redirect=/pricing')
    return
  }
  await checkout(priceId)
}

const getPlanFeatures = (plan: any) => {
  const tier = String(plan.tier || '').toLowerCase()
  const name = String(plan.product_name || '').toLowerCase()
  if (tier === 'pro' || name.includes('pro')) {
    return [
      t('feature-cv-editor') || 'Full CV Editor',
      t('feature-50-adaptations') || '50 AI adaptations / month',
    ]
  }
  if (tier === 'basic' || name.includes('basic')) {
    return [
      t('feature-cv-editor') || 'Full CV Editor',
      t('feature-20-adaptations') || '20 AI adaptations / month',
    ]
  }
  // Free plan
  return [
    t('feature-cv-editor') || 'Full CV Editor',
    t('feature-2-adaptations') || '2 AI adaptations / month',
  ]
}

const handleFreePlan = () => {
  if (!user.value) {
    navigateTo(localePath('login') + '?redirect=/test2')
    return
  }
  navigateTo(localePath('/test2'))
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-slate-900 mb-4">
          {{ t('pricing-title') || 'Choose Your Plan' }}
        </h1>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
          {{ t('pricing-subtitle') || 'Start free, upgrade when you need more.' }}
        </p>

        <!-- Current subscription status -->
        <div v-if="user && !isSubLoading && subscription?.hasActiveSubscription"
             class="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          {{ t('current-plan') || 'Current plan:' }} {{ subscription.productName }}
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isPlansLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>

      <!-- Pricing Cards -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="plan in allPlans" :key="plan.price_id"
             class="relative bg-white rounded-2xl shadow-lg border border-slate-200 p-8 flex flex-col"
             :class="{ 'ring-2 ring-violet-600 scale-105': plan.tier === 'pro' }">

          <!-- Popular Badge -->
          <div v-if="plan.tier === 'pro'"
               class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-violet-600 text-white text-xs font-semibold rounded-full">
            {{ t('most-popular') || 'Most Popular' }}
          </div>

          <div class="mb-6">
            <h3 class="text-xl font-bold text-slate-900 mb-2">{{ plan.product_name }}</h3>
            <p class="text-sm text-slate-500">{{ plan.product_description }}</p>
          </div>

          <div class="mb-6">
            <span class="text-4xl font-bold text-slate-900">
              {{ plan.unit_amount === 0 ? t('free-price-label') || 'Free' : formatPrice(plan.unit_amount, plan.currency) }}
            </span>
            <span v-if="plan.recurring?.interval" class="text-slate-500">
              / {{ plan.recurring.interval }}
            </span>
          </div>

          <ul class="space-y-3 mb-8 flex-grow">
            <li v-for="feature in getPlanFeatures(plan)"
                :key="feature"
                class="flex items-start gap-2 text-sm text-slate-600">
              <svg class="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              {{ feature }}
            </li>
          </ul>

          <!-- Free plan button -->
          <button
            v-if="plan.tier === 'free'"
            class="w-full py-3 px-6 rounded-xl font-medium text-sm transition-colors bg-slate-100 text-slate-900 hover:bg-slate-200"
            :disabled="!subscription?.hasActiveSubscription && subscription?.productName == null && user"
            @click="handleFreePlan">
            <span v-if="!subscription?.hasActiveSubscription && subscription?.productName == null && user">
              {{ t('current-plan-label') || 'Current Plan' }}
            </span>
            <span v-else-if="user">
              {{ t('start-free-button') || 'Start for Free' }}
            </span>
            <span v-else>
              {{ t('login-to-subscribe') || 'Login to Subscribe' }}
            </span>
          </button>

          <!-- Paid plan button -->
          <button
            v-else
            class="w-full py-3 px-6 rounded-xl font-medium text-sm transition-colors"
            :class="plan.tier === 'pro'
              ? 'bg-violet-600 text-white hover:bg-violet-700'
              : 'bg-slate-100 text-slate-900 hover:bg-slate-200'"
            :disabled="subscription?.hasActiveSubscription && subscription?.productName === plan.product_name"
            @click="handleCheckout(plan.stripe_price_id)">
            <span v-if="subscription?.hasActiveSubscription && subscription?.productName === plan.product_name">
              {{ t('current-plan-label') || 'Current Plan' }}
            </span>
            <span v-else-if="user">
              {{ t('subscribe-button') || 'Subscribe' }}
            </span>
            <span v-else>
              {{ t('login-to-subscribe') || 'Login to Subscribe' }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

