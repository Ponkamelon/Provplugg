import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { response, supabase, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isElevRoute = pathname.startsWith("/elev");

  if (!isAdminRoute && !isElevRoute) {
    return response;
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/logga-in";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (isAdminRoute && profile?.role !== "admin") {
    return NextResponse.redirect(new URL("/elev", request.url));
  }

  if (isElevRoute && profile?.role !== "student") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
