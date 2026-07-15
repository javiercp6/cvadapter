/**
 * Composable to fetch and manage user subscription status from Stripe via Supabase.
 * Uses the `get_user_subscription_status()` RPC function created by the Stripe Sync Engine migration.
 */
export function useSubscription() {
  const supabase = useSupabaseClient()

  const subscription = ref<{
    hasActiveSubscription: boolean
    productName: string | null
    status: string
    currentPeriodEnd: string | null
    cancelAtPeriodEnd: boolean
    billingInterval?: string
  } | null>(null)

  const isLoading = ref(true)
  const error = ref<string | null>(null)

  async function fetchSubscription() {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: rpcError } = await supabase.rpc('get_user_subscription_status')

      if (rpcError) throw rpcError

      if (data && data.length > 0) {
        const row = data[0]
        subscription.value = {
          hasActiveSubscription: row.has_active_subscription,
          productName: row.product_name || null,
          status: row.status,
          currentPeriodEnd: row.current_period_end || null,
          cancelAtPeriodEnd: row.cancel_at_period_end,
          billingInterval: row.billing_interval || undefined,
        }
      } else {
        subscription.value = {
          hasActiveSubscription: false,
          productName: null,
          status: 'none',
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
        }
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch subscription'
      console.error('useSubscription error:', e)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Redirect to Stripe Checkout for a given price ID.
   */
  async function checkout(priceId: string) {
    try {
      const response = await $fetch('/api/checkout', {
        method: 'POST',
        body: { priceId },
      })

      // Redirect to Stripe Checkout
      if (response.url) {
        window.location.href = response.url
      }
    } catch (e: any) {
      error.value = e.data?.message || 'Checkout failed. Please try again.'
      console.error('Checkout error:', e)
    }
  }

  return {
    subscription: readonly(subscription),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchSubscription,
    checkout,
  }
}
