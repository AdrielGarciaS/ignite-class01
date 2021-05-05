import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { stripe } from 'services/stripe';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method not allowed');
  }

  const session = await getSession({ req });

  const stripeCustomer = await stripe.customers.create({
    email: session.user.email,
    // metadata
  });

  const stripeCheckoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomer.id,
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    line_items: [
      {
        price: 'price_1ImKVUIkpQdfiLhQNKgCEQJs',
        quantity: 1,
      },
    ],
    mode: 'subscription',
    allow_promotion_codes: true,
    success_url: process.env.STRIPE_SUCCESS_URL,
    cancel_url: process.env.STRIPE_CANCEL_URL,
  });

  return res.status(200).json({ sessionId: stripeCheckoutSession.id });
};
