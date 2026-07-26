export type ProjectCategory =
  | "Residential"
  | "Commercial"
  | "Institutional"
  | "Interior"
  | "Urban Planning";

export type ProjectType =
  | "New Construction"
  | "Renovation"
  | "Interior Fit-out"
  | "Masterplanning";

export type ProjectStatus = "Completed" | "Ongoing" | "Concept";

export interface Project {
  id: string;
  slug: string;
  title: string;
  location: string;
  category: ProjectCategory;
  year: string;
  area: string;
  description: string;
  image: string;
  featured?: boolean;
  // CMS fields (admin prototype) — optional so existing public-site
  // components that only use the fields above continue to work unchanged.
  projectType?: ProjectType;
  status?: ProjectStatus;
  clientName?: string;
  architectName?: string;
  completionDate?: string; // ISO date string, e.g. "2024-03-15"
  displayOrder?: number;
  detailedDescription?: string;
  gallery?: string[];
  youtubeUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface Testimonial {
  id: string;
  name: string; // Client Name (required)
  quote: string; // Testimonial Message (required)
  rating: number; // 1–5
  displayOrder: number;
  featured: boolean;
  role?: string; // Designation (optional)
  company?: string; // Company Name (optional)
  avatar?: string; // Client Image (optional) — public site shows initials when absent
}

export interface Service {
  id: string;
  title: string; // Service Name (required)
  description: string; // Short Description (required)
  displayOrder: number;
  featured: boolean;
  detailedDescription?: string; // optional
  icon?: string; // optional — public site shows a default icon when absent
}

export interface ProcessStep {
  id: string;
  code: string; // e.g. "01"
  title: string;
  description: string;
}

export interface NavLink {
  label: string;
  href: string;
}

// Company Details — singleton settings row. No `companyName` field: the
// name is permanently "STYLOBATE DESIGN STUDIO" and is never stored or
// editable. No `logo` field: the logo is a fixed bundled asset
// (public/images/logo.jpg), not admin-editable or stored in Supabase.
export interface CompanyDetails {
  favicon?: string;
  yearsExperience?: number;
  awards?: number;
  about?: string;
  ourStory?: string;
  vision?: string;
  mission?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  workingHours?: string;
  address?: string;
  googleMapsLink?: string;
  appleMapsLink?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
}

// Website Settings — singleton settings row.
export interface SiteSettings {
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  footerText?: string;
  seoTitle?: string;
  seoDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
}
