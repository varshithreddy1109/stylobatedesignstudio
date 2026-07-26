import type { Metadata } from "next";
import ContactForm from "@/components/sections/ContactForm";
import { createClient } from "@/lib/supabase/server";
import { fetchCompanyDetails } from "@/lib/supabase/companyDetails";

export const metadata: Metadata = {
  title: "Contact | STYLOBATE DESIGN STUDIO",
  description: "Get in touch with STYLOBATE DESIGN STUDIO to start a project.",
};

// Always fetch fresh Company Details so this page reflects the latest admin
// save immediately, with no stale cache.
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const supabase = createClient();
  const companyDetails = await fetchCompanyDetails(supabase);

  return (
    <section className="container-studio pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <span className="label-tag">Start a Project</span>
          <h1 className="mt-5 font-display text-4xl font-medium leading-[1.1] text-ink md:text-5xl">
            Tell us about your site.
          </h1>
          <p className="mt-8 max-w-md text-base leading-relaxed text-charcoal/75">
            Share a few details about your project and we&apos;ll respond
            within two business days to schedule an initial call.
          </p>

          <div className="mt-12 flex flex-col gap-6 border-t border-hairline pt-8">
            {companyDetails.address && (
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest2 text-stone">Studio</p>
                {companyDetails.googleMapsLink ? (
                  <a
                    href={companyDetails.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-sm leading-relaxed text-charcoal/80 underline decoration-hairline decoration-1 underline-offset-4 hover:text-ink hover:decoration-brass"
                  >
                    {companyDetails.address.split("\n").map((line, idx) => (
                      <span key={idx}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </a>
                ) : (
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
                    {companyDetails.address.split("\n").map((line, idx) => (
                      <span key={idx}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                )}
              </div>
            )}
            {companyDetails.email && (
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest2 text-stone">Email</p>
                <p className="mt-2 text-sm text-charcoal/80">{companyDetails.email}</p>
              </div>
            )}
            {companyDetails.phone && (
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest2 text-stone">Phone</p>
                <p className="mt-2 text-sm text-charcoal/80">{companyDetails.phone}</p>
              </div>
            )}
            {companyDetails.workingHours && (
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest2 text-stone">Working Hours</p>
                <p className="mt-2 text-sm text-charcoal/80">{companyDetails.workingHours}</p>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
