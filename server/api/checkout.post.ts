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
