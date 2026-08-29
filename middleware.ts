import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isElevRoute = pathname.startsWith("/elev");

  try {
    const { response, supabase, user } = await updateSession(request);

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
  } catch (err) {
    console.error("Middleware error:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*", "/elev/:path*"],
};
