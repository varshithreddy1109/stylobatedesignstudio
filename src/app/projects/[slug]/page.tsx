import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { fetchProjectBySlug } from "@/lib/supabase/projects";

export const dynamic = "force-dynamic";

interface ProjectDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const supabase = createClient();
  const project = await fetchProjectBySlug(supabase, params.slug);

  if (!project) {
    return { title: "Project Not Found | STYLOBATE DESIGN STUDIO" };
  }

  return {
    title: project.metaTitle || `${project.title} | STYLOBATE DESIGN STUDIO`,
    description: project.metaDescription || project.description,
  };
}

function getYouTubeEmbedUrl(url: string): string | null {
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (!watchMatch) return null;
  return `https://www.youtube.com/embed/${watchMatch[1]}`;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const supabase = createClient();
  const project = await fetchProjectBySlug(supabase, params.slug);

  if (!project) {
    return (
      <section className="container-studio flex flex-col items-center gap-6 pb-24 pt-32 text-center md:pt-40">
        <span className="label-tag">Projects</span>
        <h1 className="font-display text-3xl font-medium text-ink md:text-4xl">
          Project Not Found
        </h1>
        <p className="max-w-md text-sm text-charcoal/70">
          This project may have been removed, or the link may be out of date.
        </p>
        <Button href="/projects" variant="secondary">
          ← All Projects
        </Button>
      </section>
    );
  }

  const embedUrl = project.youtubeUrl ? getYouTubeEmbedUrl(project.youtubeUrl) : null;

  const infoItems = [
    { label: "Client", value: project.clientName },
    { label: "Architect", value: project.architectName },
    { label: "Location", value: project.location },
    { label: "Area", value: project.area },
    { label: "Status", value: project.status },
  ].filter((item) => item.value);

  return (
    <>
      <section className="pt-20 md:pt-24">
        <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[21/9]">
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      </section>

      <section className="container-studio py-16 md:py-24">
        <Link
          href="/projects"
          className="text-sm text-charcoal/70 underline decoration-hairline decoration-1 underline-offset-4 hover:text-ink hover:decoration-brass"
        >
          ← All Projects
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <span className="label-tag">
              {project.category}
              {project.year ? ` — ${project.year}` : ""}
            </span>
            <h1 className="mt-4 font-display text-3xl font-medium leading-[1.1] text-ink md:text-5xl">
              {project.title}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-charcoal/75 md:text-lg">
              {project.description}
            </p>
            {project.detailedDescription && (
              <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-charcoal/70">
                {project.detailedDescription}
              </p>
            )}
          </div>

          {infoItems.length > 0 && (
            <div className="md:col-span-4 md:col-start-9">
              <div className="flex flex-col divide-y divide-hairline border-t border-hairline">
                {infoItems.map((item) => (
                  <div key={item.label} className="flex items-baseline justify-between gap-4 py-4">
                    <span className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
                      {item.label}
                    </span>
                    <span className="text-right text-sm text-charcoal/80">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {embedUrl && (
          <div className="relative mt-16 aspect-video w-full overflow-hidden">
            <iframe
              src={embedUrl}
              title={`${project.title} video`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-16">
            <span className="label-tag">Gallery</span>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {project.gallery.map((imageUrl, idx) => (
                <div key={imageUrl + idx} className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal/5">
                  <Image
                    src={imageUrl}
                    alt={`${project.title} — image ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
