import Stripe from 'stripe'
import { createServerClient } from '@supabase/ssr'
import { parseCookies, setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const supabaseUrl = useRuntimeConfig(event).public.supabaseUrl as string
  const supabaseKey = useRuntimeConfig(event).public.supabaseKey as string

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return Object.entries(parseCookies(event)).map(([name, value]) => ({ name, value }))
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          setCookie(event, name, value, options)
        }
      },
    },
  })

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
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
