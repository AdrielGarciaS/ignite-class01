/* eslint-disable no-case-declarations */
import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from 'services/stripe';
import { Readable } from 'stream';
import Stripe from 'stripe';
import { saveSubscription } from './_lib/manageSubscription';

const buffer = async (readable: Readable) => {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
};

export const config = {
  api: {
    bodyParser: false,
  },
};

enum EventTypes {
  CHECKOUT_SESSION_COMPLETED = 'checkout.session.completed',
  CUSTOMER_SUBSCRIPTION_CREATED = 'customer.subscription.created',
  CUSTOMER_SUBSCRIPTION_UPDATED = 'customer.subscription.updated',
  CUSTOMER_SUBSCRIPTION_DELETED = 'customer.subscription.deleted',
}

const relevantEvents = new Set([
  EventTypes.CHECKOUT_SESSION_COMPLETED,
  EventTypes.CUSTOMER_SUBSCRIPTION_UPDATED,
  EventTypes.CUSTOMER_SUBSCRIPTION_DELETED,
]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method not allowed');
  }

  const buf = await buffer(req);
  const secret = req.headers['stripe-signature'];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      secret,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  const type = event.type as EventTypes;

  if (!relevantEvents.has(type)) return res.json({ received: true });

  try {
    switch (type) {
      case EventTypes.CUSTOMER_SUBSCRIPTION_UPDATED:
      case EventTypes.CUSTOMER_SUBSCRIPTION_DELETED:
        const subscription = event.data.object as Stripe.Subscription;

        await saveSubscription({
          subscriptionId: subscription.id,
          customerId: String(subscription.customer),
        });

        break;

      case EventTypes.CHECKOUT_SESSION_COMPLETED:
        const checkoutSession = event.data.object as Stripe.Checkout.Session;

        await saveSubscription({
          subscriptionId: String(checkoutSession.subscription),
          customerId: String(checkoutSession.customer),
          createAction: true,
        });
        break;

      default:
        throw new Error('Unhandled event.');
    }
  } catch (error) {
    return res.json({ error: 'Webhook handler failed.' });
  }

  console.log('Evento recebido', event);
};
