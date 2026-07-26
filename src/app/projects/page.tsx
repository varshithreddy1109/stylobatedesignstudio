import type { Metadata } from "next";
import ProjectsHeader from "@/components/sections/ProjectsHeader";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import ContactCTA from "@/components/sections/home/ContactCTA";
import { createClient } from "@/lib/supabase/server";
import { fetchAllProjects } from "@/lib/supabase/projects";

export const metadata: Metadata = {
  title: "Projects | STYLOBATE DESIGN STUDIO",
  description:
    "Explore residential, commercial, institutional, interior, and urban planning projects by STYLOBATE DESIGN STUDIO.",
};

// Always fetch fresh data so admin add/edit/delete actions are reflected
// immediately, with no stale cache.
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const supabase = createClient();
  const projects = await fetchAllProjects(supabase);

  return (
    <>
      <ProjectsHeader />
      <ProjectsGrid initialProjects={projects} />
      <ContactCTA />
    </>
  );
}
