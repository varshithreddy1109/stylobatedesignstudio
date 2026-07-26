import { redirect } from "next/navigation";

/**
 * Forwards to the existing Company Details page at /admin/company-details.
 * Kept as a separate route so /admin/company (as referenced in the auth
 * requirements) resolves correctly without renaming the existing page.
 */
export default function AdminCompanyRedirect() {
  redirect("/admin/company-details");
}
