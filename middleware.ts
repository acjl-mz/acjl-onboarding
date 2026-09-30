import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path.startsWith("/diagnostico/briefing") && request.cookies.get("acjl-consultant-access")?.value !== "1") {
    return NextResponse.redirect(new URL("/diagnostico/inicio", request.url));
  }

  let response = NextResponse.next({ request });
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({name,value}) => request.cookies.set(name,value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({name,value,options}) => response.cookies.set(name,value,options));
        }
      }
    });
    const { data: { user } } = await supabase.auth.getUser();
    if (path.startsWith("/admin") && !path.startsWith("/admin/login") && !user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
  return response;
}
export const config = { matcher: ["/admin/:path*", "/diagnostico/briefing/:path*"] };
