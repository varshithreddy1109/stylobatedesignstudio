import type { Metadata } from "next";
import AboutHeader from "@/components/sections/about/AboutHeader";
import Story from "@/components/sections/about/Story";
import VisionMission from "@/components/sections/about/VisionMission";
import Process from "@/components/sections/about/Process";
import ContactCTA from "@/components/sections/home/ContactCTA";
import { createClient } from "@/lib/supabase/server";
import { fetchCompanyDetails } from "@/lib/supabase/companyDetails";

export const metadata: Metadata = {
  title: "About | STYLOBATE DESIGN STUDIO",
  description:
    "Learn about STYLOBATE DESIGN STUDIO's story, vision, mission, and design process.",
};

// Always fetch fresh Company Details so this page reflects the latest
// admin save immediately, with no stale cache.
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const supabase = createClient();
  const companyDetails = await fetchCompanyDetails(supabase);

  return (
    <>
      <AboutHeader about={companyDetails.about} />
      <Story story={companyDetails.ourStory} />
      <VisionMission vision={companyDetails.vision} mission={companyDetails.mission} />
      <Process />
      <ContactCTA />
    </>
  );
}
