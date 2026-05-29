export function usePlanUsage() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const tier = ref<'free' | 'basic' | 'pro'>('free')
  const limit = ref(2)
  const current = ref(0)
  const isLoading = ref(true)
  const productName = ref<string | null>(null)

  async function fetchUsage() {
    isLoading.value = true

    try {
      // 1. Obtener plan desde suscripción (no depende de user.value)
      const { data: subData } = await supabase.rpc('get_user_subscription_status')
      const sub = subData?.[0]

      if (sub?.has_active_subscription) {
        const name = (sub.product_name || '').toLowerCase()
        if (name.includes('pro')) {
          tier.value = 'pro'
          limit.value = 50
        }
        else if (name.includes('basic')) {
          tier.value = 'basic'
          limit.value = 20
        }
        else {
          tier.value = 'basic'
          limit.value = 20
        }
        productName.value = sub.product_name
      }
      else {
        tier.value = 'free'
        limit.value = 2
        productName.value = null
      }

      // 2. Obtener contador del mes actual (solo si el usuario ya cargó)
      const userId = user.value?.id || user.value?.sub
      if (userId) {
        const month = new Date().toISOString().slice(0, 7) // YYYY-MM
        const { data: usageData } = await supabase
          .from('user_monthly_usage')
          .select('adaptations_count')
          .eq('user_id', userId)
          .eq('usage_month', month)
          .maybeSingle()

        current.value = usageData?.adaptations_count || 0
      }
    }
    catch (e) {
      console.error('usePlanUsage error:', e)
    }
    finally {
      isLoading.value = false
    }
  }

  // Re-fetch automáticamente cuando el usuario de Supabase finalmente cargue
  watch(user, (newUser) => {
    if (newUser?.id || newUser?.sub) fetchUsage()
  }, { immediate: true })

  const remaining = computed(() => Math.max(0, limit.value - current.value))
  const canAdapt = computed(() => remaining.value > 0)

  return {
    tier: readonly(tier),
    limit: readonly(limit),
    current: readonly(current),
    remaining,
    canAdapt,
    productName: readonly(productName),
    isLoading: readonly(isLoading),
    fetchUsage,
  }
}
