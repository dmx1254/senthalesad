// NEXT_PUBLIC_* is inlined at build time: changing it on Vercel requires a redeploy.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://manage.senthalesmarket.com"
).replace(/\/+$/, "");
