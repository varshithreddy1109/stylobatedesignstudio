import Hero from "@/components/sections/home/Hero";
import Intro from "@/components/sections/home/Intro";
import WhyChooseUs from "@/components/sections/home/WhyChooseUs";
import FeaturedServices from "@/components/sections/home/FeaturedServices";
import FeaturedProjects from "@/components/sections/home/FeaturedProjects";
import TestimonialsPreview from "@/components/sections/home/TestimonialsPreview";
import ContactCTA from "@/components/sections/home/ContactCTA";
import { createClient } from "@/lib/supabase/server";
import { fetchFeaturedProjects, countProjects } from "@/lib/supabase/projects";
import { fetchFeaturedTestimonials } from "@/lib/supabase/testimonials";
import { fetchAllServices } from "@/lib/supabase/services";
import { fetchCompanyDetails } from "@/lib/supabase/companyDetails";

// Always fetch fresh data so admin changes (add/edit/delete/feature) are
// reflected on the homepage immediately, with no stale cache.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = createClient();
  const [featuredProjects, featuredTestimonials, services, companyDetails, totalProjects] =
    await Promise.all([
      fetchFeaturedProjects(supabase, 3),
      fetchFeaturedTestimonials(supabase, 2),
      fetchAllServices(supabase),
      fetchCompanyDetails(supabase),
      countProjects(supabase),
    ]);

  return (
    <>
      <Hero />
      <Intro
        about={companyDetails.about}
        yearsExperience={companyDetails.yearsExperience}
        awards={companyDetails.awards}
        totalProjects={totalProjects}
      />
      <WhyChooseUs />
      <FeaturedServices services={services} />
      <FeaturedProjects projects={featuredProjects} />
      <TestimonialsPreview testimonials={featuredTestimonials} />
      <ContactCTA />
    </>
  );
}
