"use client";

import { useState } from "react";
import Image from "next/image";
import { projectCategories } from "@/data/projects";
import { Project, ProjectCategory } from "@/types";
import Button from "@/components/ui/Button";

type FilterValue = ProjectCategory | "All";

export default function ProjectsGrid({ initialProjects }: { initialProjects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("All");

  // Fresh Supabase project with nothing added yet through the Admin Panel —
  // show a professional empty state instead of the filter UI.
  if (initialProjects.length === 0) {
    return (
      <section className="container-studio pb-24 md:pb-32">
        <div className="flex flex-col items-center gap-3 border border-dashed border-hairline py-24 text-center">
          <span className="label-tag">Projects</span>
          <p className="text-base text-charcoal/70 md:text-lg">
            No projects have been added yet.
          </p>
          <p className="max-w-sm text-sm text-charcoal/50">
            Check back soon — new work is added regularly.
          </p>
        </div>
      </section>
    );
  }

  const filteredProjects =
    activeFilter === "All"
      ? initialProjects
      : initialProjects.filter((project) => project.category === activeFilter);

  return (
    <section className="container-studio pb-24 md:pb-32">
      {/* Category filters */}
      <div className="flex flex-wrap gap-3 border-b border-hairline pb-8">
        {projectCategories.map((category) => {
          const active = activeFilter === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2.5 text-sm tracking-wide transition-colors duration-300 ease-studio ${
                active
                  ? "bg-ink text-paper"
                  : "bg-transparent text-charcoal/70 border border-hairline hover:border-ink hover:text-ink"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Project grid */}
      <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <article key={project.id} id={project.slug} className="group flex flex-col">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal/5">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-studio group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 bg-paper/90 px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 text-ink">
                {project.category}
              </span>
            </div>

            <div className="flex flex-col gap-3 pt-6">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl font-medium text-ink md:text-[1.4rem]">
                  {project.title}
                </h3>
                <span className="shrink-0 font-mono text-xs text-stone">
                  {project.year}
                </span>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
                {project.location} — {project.area}
              </p>
              <p className="text-sm leading-relaxed text-charcoal/70">
                {project.description}
              </p>
              {/* Detail button — links to the public project detail page */}
              <Button
                href={`/projects/${project.slug}`}
                variant="ghost"
                className="mt-2 self-start !px-0 !py-0 text-ink underline decoration-hairline decoration-1 underline-offset-4 hover:decoration-brass"
              >
                View Project Detail →
              </Button>
            </div>
          </article>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <p className="mt-16 text-center font-mono text-sm text-stone">
          No projects in this category yet.
        </p>
      )}
    </section>
  );
}
