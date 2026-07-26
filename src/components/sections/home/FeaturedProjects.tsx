import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { Project } from "@/types";

export default function FeaturedProjects({ projects }: { projects: Project[] }) {
  // No featured projects yet (fresh Supabase project, nothing added through
  // the Admin Panel) — skip the section rather than showing an empty grid.
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="container-studio py-24 md:py-32">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <SectionTitle
          eyebrow="Selected Work"
          title="A sample of recent projects."
        />
        <Button href="/projects" variant="secondary" className="hidden md:inline-flex">
          View All Projects
        </Button>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-3">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.slug}`}>
            <Card
              image={project.image}
              imageAlt={project.title}
              eyebrow={`${project.category} — ${project.year}`}
              title={project.title}
              description={project.location}
              aspect="portrait"
            />
          </Link>
        ))}
      </div>

      <div className="mt-12 md:hidden">
        <Button href="/projects" variant="secondary" className="w-full">
          View All Projects
        </Button>
      </div>
    </section>
  );
}
