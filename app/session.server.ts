import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

type SessionData = {
  message: string;
  id: string;
};

type SessionFlashData = {
  message: string;
  id: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__session",
    },
  });

export { getSession, commitSession, destroySession };
