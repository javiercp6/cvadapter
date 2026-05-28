/**
 * Middleware: require-auth
 * Usage: definePageMeta({ middleware: 'require-auth' })
 *
 * Redirects to /login if the user is not authenticated.
 * Allows all authenticated users regardless of subscription status.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()

  if (!user.value) {
    return navigateTo(`/login?redirect=${to.fullPath}`)
  }
})
