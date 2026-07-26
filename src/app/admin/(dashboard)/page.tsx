import type { Metadata } from "next";
import SectionTitle from "@/components/ui/SectionTitle";
import StatCard from "@/components/admin/StatCard";
import QuickActionCard from "@/components/admin/QuickActionCard";
import { getDashboardStats, quickActions } from "@/data/admin";
import { createClient } from "@/lib/supabase/server";
import { countProjects } from "@/lib/supabase/projects";
import { countTestimonials } from "@/lib/supabase/testimonials";
import { countServices } from "@/lib/supabase/services";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
};

// Always fetch fresh counts so the stats reflect the latest add/delete the
// moment the admin lands on the dashboard.
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = createClient();
  const [projectCount, testimonialCount, serviceCount] = await Promise.all([
    countProjects(supabase),
    countTestimonials(supabase),
    countServices(supabase),
  ]);
  const dashboardStats = getDashboardStats(projectCount, testimonialCount, serviceCount);

  return (
    <div className="flex flex-col gap-14">
      <div>
        <span className="label-tag">Admin</span>
        <h1 className="mt-4 font-display text-3xl font-medium text-ink md:text-4xl">
          Welcome
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-charcoal/70 md:text-base">
          Here&apos;s a snapshot of the site. Every module — Projects,
          Testimonials, Services, Company Details, and Settings — is backed
          by live Supabase data.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <SectionTitle eyebrow="Quick Actions" title="Jump back into common tasks." />
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <QuickActionCard key={action.id} action={action} />
          ))}
        </div>
      </div>
    </div>
  );
}
