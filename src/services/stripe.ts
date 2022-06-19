import Stripe from 'stripe';
import * as packageInfo from '../../package.json';

export const stripe = new Stripe(
  process.env.STRIPE_API_KEY,
  {
    apiVersion: "2020-08-27",
    appInfo: {
      name: "ig.news",
      version: packageInfo.version,
    }
  }
);