import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const LOCALE_PREFIX = /^\/(en|id)(?=\/|$)/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const match = pathname.match(LOCALE_PREFIX);
  const locale = match?.[1] === "en" ? "en" : "id";

  // Canonicalize Indonesian: never keep `/id` in the URL.
  if (match?.[1] === "id") {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(LOCALE_PREFIX, "") || "/";
    return NextResponse.redirect(url);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  // Keep `/en/...` in the browser, but serve the underlying route at `/<path>`.
  if (match?.[1] === "en") {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(LOCALE_PREFIX, "") || "/";
    // Make locale visible to client hooks even though the pathname is rewritten.
    url.searchParams.set("__locale", "en");
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  // Default locale (id): pass locale through headers.
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};

