"use client";

import { useState } from "react";
import Link from "next/link";
import { Project } from "@/types";
import Button from "@/components/ui/Button";
import Toast, { useToast } from "@/components/admin/Toast";
import { supabase } from "@/lib/supabase/client";
import { deleteProject } from "@/lib/supabase/projects";

function formatDate(dateString?: string) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

const statusStyles: Record<NonNullable<Project["status"]>, string> = {
  Completed: "bg-charcoal/10 text-charcoal",
  Ongoing: "bg-brass/15 text-brass-dark",
  Concept: "bg-stone/15 text-stone",
};

export default function ProjectsTable({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { message, showToast } = useToast();

  async function handleDelete(project: Project) {
    const confirmed = window.confirm(
      `Delete "${project.title}"? This permanently removes it from the live database and cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(project.id);
    try {
      await deleteProject(supabase, project.id);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      showToast(`"${project.title}" was deleted.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again.";
      showToast(`Couldn't delete "${project.title}" — ${message}`);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="font-mono text-xs text-stone">
        {projects.length} project{projects.length === 1 ? "" : "s"}
      </p>

      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto border border-hairline md:block">
        <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-hairline bg-charcoal/[0.03]">
              {["Cover", "Project", "Category / Type", "Client / Architect", "Location / Area", "Completion", "Status", "Featured", "Order", "Actions"].map(
                (heading) => (
                  <th key={heading} className="whitespace-nowrap px-4 py-3 font-mono text-[11px] uppercase tracking-widest2 text-stone">
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-hairline last:border-b-0 hover:bg-charcoal/[0.02]">
                <td className="px-4 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.image} alt={project.title} className="h-12 w-16 object-cover" />
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{project.title}</p>
                  <p className="font-mono text-xs text-stone">/{project.slug}</p>
                </td>
                <td className="px-4 py-3 text-charcoal/80">
                  <p>{project.category}</p>
                  <p className="text-xs text-charcoal/50">{project.projectType ?? "—"}</p>
                </td>
                <td className="px-4 py-3 text-charcoal/80">
                  <p>{project.clientName ?? "—"}</p>
                  <p className="text-xs text-charcoal/50">{project.architectName ?? "—"}</p>
                </td>
                <td className="px-4 py-3 text-charcoal/80">
                  <p>{project.location}</p>
                  <p className="text-xs text-charcoal/50">{project.area}</p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-charcoal/80">
                  {formatDate(project.completionDate)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`whitespace-nowrap px-2.5 py-1 text-xs font-medium ${
                      project.status ? statusStyles[project.status] : "bg-charcoal/10 text-charcoal"
                    }`}
                  >
                    {project.status ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3">{project.featured ? "★" : "—"}</td>
                <td className="px-4 py-3 text-charcoal/80">{project.displayOrder ?? "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <a
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-charcoal/70 underline decoration-hairline underline-offset-4 hover:text-ink hover:decoration-brass"
                    >
                      View
                    </a>
                    <Link
                      href={`/admin/projects/${project.slug}/edit`}
                      className="text-xs text-charcoal/70 underline decoration-hairline underline-offset-4 hover:text-ink hover:decoration-brass"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(project)}
                      disabled={deletingId === project.id}
                      className="text-xs text-charcoal/70 underline decoration-hairline underline-offset-4 hover:text-ink hover:decoration-brass disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === project.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="flex flex-col gap-4 md:hidden">
        {projects.map((project) => (
          <div key={project.id} className="flex gap-4 border border-hairline p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.image} alt={project.title} className="h-20 w-24 shrink-0 object-cover" />
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-ink">{project.title}</p>
                  <p className="font-mono text-[11px] text-stone">/{project.slug}</p>
                </div>
                <span
                  className={`shrink-0 px-2 py-0.5 text-[11px] font-medium ${
                    project.status ? statusStyles[project.status] : "bg-charcoal/10 text-charcoal"
                  }`}
                >
                  {project.status ?? "—"}
                </span>
              </div>
              <p className="text-xs text-charcoal/60">
                {project.category} · {project.location}
              </p>
              <p className="text-xs text-charcoal/60">
                {project.clientName ?? "—"} · Order {project.displayOrder ?? "—"}
                {project.featured ? " · ★ Featured" : ""}
              </p>
              <div className="mt-2 flex items-center gap-4">
                <a
                  href={`/projects/${project.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-charcoal/70 underline decoration-hairline underline-offset-4"
                >
                  View
                </a>
                <Link
                  href={`/admin/projects/${project.slug}/edit`}
                  className="text-xs text-charcoal/70 underline decoration-hairline underline-offset-4"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(project)}
                  disabled={deletingId === project.id}
                  className="text-xs text-charcoal/70 underline decoration-hairline underline-offset-4 disabled:opacity-50"
                >
                  {deletingId === project.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="flex flex-col items-center gap-4 border border-dashed border-hairline py-16 text-center">
          <p className="text-sm text-charcoal/60">No projects yet.</p>
          <Button href="/admin/projects/new" variant="secondary">
            Add Project
          </Button>
        </div>
      )}

      <Toast message={message} />
    </div>
  );
}
