/**
 * Middleware: require-subscription
 * Usage: definePageMeta({ middleware: 'require-subscription' })
 *
 * Redirects to /pricing if the user doesn't have an active subscription.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()

  if (!user.value) {
    return navigateTo(`/login?redirect=${to.fullPath}`)
  }

  const { subscription, fetchSubscription } = useSubscription()
  await fetchSubscription()

  if (!subscription.value?.hasActiveSubscription) {
    return navigateTo('/pricing')
  }
})
