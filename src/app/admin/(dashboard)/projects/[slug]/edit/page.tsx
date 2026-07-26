import type { Metadata } from "next";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProjectForm from "@/components/admin/ProjectForm";
import { createClient } from "@/lib/supabase/server";
import { fetchProjectBySlug } from "@/lib/supabase/projects";

export const metadata: Metadata = {
  title: "Edit Project | Admin",
};

// Projects are created dynamically through the Admin Panel, so this route
// can't be statically pre-rendered — always fetch the current row by slug.
export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const project = await fetchProjectBySlug(supabase, params.slug);

  if (!project) {
    return (
      <div className="flex flex-col gap-4">
        <AdminPageHeader eyebrow="Projects" title="Project Not Found" />
        <p className="text-sm text-charcoal/70">
          No project matches this slug. It may have been deleted, or the
          slug may have changed.
        </p>
      </div>
    );
  }

  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <AdminPageHeader
        eyebrow="Projects"
        title={`Edit — ${project.title}`}
        description="Changes are saved directly to the live database."
      />
      <ProjectForm mode="edit" project={project} />
    </div>
  );
}
