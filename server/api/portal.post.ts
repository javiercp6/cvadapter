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
