import type { Metadata } from "next";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProjectsTable from "@/components/admin/ProjectsTable";
import { createClient } from "@/lib/supabase/server";
import { fetchAllProjects } from "@/lib/supabase/projects";

export const metadata: Metadata = {
  title: "Projects Management | Admin",
};

// Always fetch fresh data so this list reflects the latest add/edit/delete
// the moment the admin returns to it.
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const supabase = createClient();
  const projects = await fetchAllProjects(supabase);

  return (
    <div className="flex flex-col gap-10">
      <AdminPageHeader
        eyebrow="Projects"
        title="Projects Management"
        description="Add, edit, and manage every project shown on the public Projects page."
        actionLabel="Add Project"
        actionHref="/admin/projects/new"
      />
      <ProjectsTable initialProjects={projects} />
    </div>
  );
}
