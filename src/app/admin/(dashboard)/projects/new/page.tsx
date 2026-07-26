import type { Metadata } from "next";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProjectForm from "@/components/admin/ProjectForm";

export const metadata: Metadata = {
  title: "Add Project | Admin",
};

export default function AddProjectPage() {
  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <AdminPageHeader
        eyebrow="Projects"
        title="Add Project"
        description="Create a new project entry. This prototype form does not save data anywhere yet."
      />
      <ProjectForm mode="add" />
    </div>
  );
}
