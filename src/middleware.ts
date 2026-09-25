import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createMiddleware({
  locales: ["en", "fr"],
  defaultLocale: "en",
  localePrefix: "always",
});

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.NEXTAUTH_SECRET;

  // ── Back-office opérationnel : rôle ADMIN requis ─────────────────────
  // (aucun lien public n'y pointe ; les clients sont renvoyés vers leur espace)
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();

    const token = await getToken({ req, secret });
    if (!token) {
      const login = req.nextUrl.clone();
      login.pathname = "/admin/login";
      login.search = "";
      return NextResponse.redirect(login);
    }
    if (token.role !== "ADMIN") {
      const portal = req.nextUrl.clone();
      portal.pathname = "/en/portal";
      portal.search = "";
      return NextResponse.redirect(portal);
    }
    return NextResponse.next();
  }

  // ── Espace client /portal : session requise (toutes langues) ─────────
  const portalMatch = pathname.match(/^\/(en|fr)\/portal(\/.*)?$/);
  if (portalMatch) {
    const locale = portalMatch[1];
    if (pathname === `/${locale}/portal/login`) return intlMiddleware(req);

    const token = await getToken({ req, secret });
    if (!token) {
      const login = req.nextUrl.clone();
      login.pathname = `/${locale}/portal/login`;
      login.search = "";
      return NextResponse.redirect(login);
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
