import { redirect } from "next/navigation";

/**
 * /admin/dashboard is the canonical post-login destination requested for
 * this project. The actual dashboard UI lives at /admin (inside the
 * sidebar-wrapped route group at src/app/admin/(dashboard)/page.tsx) to
 * avoid restructuring the existing admin route layout — this route simply
 * forwards there. It is still covered by src/middleware.ts's /admin/:path*
 * matcher, so it's protected the same as every other admin route.
 */
export default function AdminDashboardRedirect() {
  redirect("/admin");
}
