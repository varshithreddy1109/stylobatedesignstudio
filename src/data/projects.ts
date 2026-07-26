import { Project } from "@/types";

// Option lists used by the public category filter UI and the Admin CMS
// Add/Edit Project form. Actual project records now live in Supabase (see
// src/lib/supabase/projects.ts) — no project data is hardcoded here.
export const projectCategories: Array<Project["category"] | "All"> = [
  "All",
  "Residential",
  "Commercial",
  "Institutional",
  "Interior",
  "Urban Planning",
];

export const projectTypes: Project["projectType"][] = [
  "New Construction",
  "Renovation",
  "Interior Fit-out",
  "Masterplanning",
];

export const projectStatuses: Project["status"][] = [
  "Completed",
  "Ongoing",
  "Concept",
];
