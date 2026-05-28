import { serverSupabaseUser , serverSupabaseClient  } from '#supabase/server'

export interface ResolvedPlan {
  tier: 'free' | 'basic' | 'pro'
  limit: number
  productName: string | null
}

export async function resolveUserPlan(event: H3Event): Promise<ResolvedPlan> {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const supabase = await serverSupabaseClient(event)

  const { data, error } = await supabase.rpc('get_user_subscription_status')

  if (error) {
    console.error('Plan resolution error:', error)
    // Fallback seguro: no bloqueamos al usuario por un error de Stripe Sync
    return { tier: 'free', limit: 2, productName: null }
  }

  const sub = data?.[0]
  const name = (sub?.product_name || '').toLowerCase()

  if (sub?.has_active_subscription) {
    if (name.includes('pro')) {
      return { tier: 'pro', limit: 50, productName: sub.product_name }
    }
    if (name.includes('basic')) {
      return { tier: 'basic', limit: 20, productName: sub.product_name }
    }
    // Fallback para cualquier otro plan de pago
    return { tier: 'basic', limit: 20, productName: sub.product_name }
  }

  return { tier: 'free', limit: 2, productName: null }
}
