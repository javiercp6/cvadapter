/**
 * Composable to fetch available pricing plans from Supabase.
 * Uses a raw SQL query via RPC to avoid schema/policy issues.
 */
export function usePricingPlans() {
  const supabase = useSupabaseClient()

  const plans = ref<any[]>([])
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  async function fetchPlans() {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: rpcError } = await supabase.rpc('get_pricing_plans')

      if (rpcError) throw rpcError

      // Map RPC response to consistent format
      plans.value = (data || []).map((item: any) => ({
        price_id: item.price_id,
        stripe_price_id: item.price_id, // alias for template compatibility
        currency: item.currency,
        unit_amount: item.unit_amount,
        recurring: item.recurring,
        product_name: item.product_name,
        product_description: item.product_description || '',
        tier: item.tier || 'default',
      }))
    } catch (e: any) {
      // Fallback: try direct query if RPC doesn't exist yet
      try {
        const { data, error: queryError } = await supabase
          .schema('stripe')
          .from('prices')
          .select(`
            id, currency, unit_amount, type, recurring, active, metadata,
            products (
              name,
              description,
              active,
              metadata
            )
          `)
          .eq('type', 'recurring')
          .eq('active', true)
          .order('unit_amount', { ascending: true })

        if (queryError) throw queryError

        plans.value = (data || []).map((item: any) => ({
          price_id: item.id,
          stripe_price_id: item.id,
          currency: item.currency,
          unit_amount: item.unit_amount,
          recurring: item.recurring,
          product_name: item.products?.name || 'Unknown',
          product_description: item.products?.description || '',
          tier: item.products?.metadata?.tier || 'default',
        }))
      } catch (e2: any) {
        error.value = e2.message || 'Failed to fetch pricing plans'
        console.error('usePricingPlans error:', e2)
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    plans: readonly(plans),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchPlans,
  }
}

  // types/pricing.ts (O puedes ponerlo en el mismo archivo)
/* export interface PricingPlan {
  price_id: string
  stripe_price_id: string
  currency: string
  unit_amount: number | null
  recurring: any // Puedes tipar esto mejor según la respuesta de Stripe
  product_name: string
  product_description: string
  tier: string
}

export function usePricingPlans() {
  const supabase = useSupabaseClient()

  // useAsyncData maneja automáticamente SSR, isLoading (pending), error y el estado
  const {
    data: plans,
    pending: isLoading,
    error,
    refresh: fetchPlans // Exponemos refresh como fetchPlans para recargar si es necesario
  } = useAsyncData<PricingPlan[]>('pricing-plans', async () => {
    
    // 1. Intentar con RPC
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_pricing_plans')

    if (!rpcError && rpcData) {
      return rpcData.map((item: any) => ({
        price_id: item.price_id,
        stripe_price_id: item.price_id,
        currency: item.currency,
        unit_amount: item.unit_amount,
        recurring: item.recurring,
        product_name: item.product_name,
        product_description: item.product_description || '',
        tier: item.tier || 'default',
      }))
    }

    // 2. Fallback: Consulta directa si el RPC falla
    // Nota: Ajusta 'stripe.prices' y 'products' según tu esquema real en la base de datos
    const { data: queryData, error: queryError } = await supabase
      .schema('stripe') // Si tus tablas están en el esquema 'stripe'
      .from('prices')
      .select(`
        id, 
        currency, 
        unit_amount, 
        type, 
        recurring, 
        active, 
        metadata,
        products (
          name,
          description,
          active,
          metadata
        )
      `)
      .eq('type', 'recurring')
      .eq('active', true)
      .order('unit_amount', { ascending: true })

    if (queryError) {
      console.error('usePricingPlans error:', queryError)
      throw new Error(queryError.message || 'Failed to fetch pricing plans')
    }

    // Mapear los datos del Fallback
    return (queryData || []).map((item: any) => ({
      price_id: item.id,
      stripe_price_id: item.id,
      currency: item.currency,
      unit_amount: item.unit_amount,
      recurring: item.recurring,
      product_name: item.products?.name || 'Unknown',
      product_description: item.products?.description || '',
      tier: item.products?.metadata?.tier || 'default',
    }))
    
  }, {
    // default asegura que data.value siempre sea un array y no null inicialmente
    default: () => []
  })

  return {
    plans,     // Ya es reactivo y readonly por defecto desde useAsyncData
    isLoading, // pending
    error,
    fetchPlans // refresh
  }
} */