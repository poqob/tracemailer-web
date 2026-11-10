import { onRequestPost as handleContact } from './functions/api/contact.js';
import { onRequestGet as handlePlans } from './functions/api/public/plans.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Context object compatible with Cloudflare Pages Functions
    const context = {
      request,
      env,
      params: {},
      waitUntil: (promise) => ctx.waitUntil(promise),
      next: () => (env.ASSETS ? env.ASSETS.fetch(request) : new Response('Not Found', { status: 404 }))
    };

    // Route: /api/contact
    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(context);
    }

    // Route: /api/plans or /api/public/plans
    if ((url.pathname === '/api/plans' || url.pathname === '/api/public/plans') && request.method === 'GET') {
      return handlePlans(context);
    }

    // Static assets fallback
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};
