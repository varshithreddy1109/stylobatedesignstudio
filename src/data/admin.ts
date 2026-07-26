export interface AdminNavLink {
  label: string;
  href: string;
  icon: "dashboard" | "projects" | "testimonials" | "services" | "company" | "settings" | "logout";
}

export const adminNavLinks: AdminNavLink[] = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Projects", href: "/admin/projects", icon: "projects" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "testimonials" },
  { label: "Services", href: "/admin/services", icon: "services" },
  { label: "Company Details", href: "/admin/company-details", icon: "company" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];

export const adminLogoutLink: AdminNavLink = {
  label: "Logout",
  href: "/admin/login",
  icon: "logout",
};

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  hint: string;
}

// Total Projects, Total Testimonials, and Total Services are all live
// (passed in from Supabase count queries on the Dashboard page).
export function getDashboardStats(
  projectCount: number,
  testimonialCount: number,
  serviceCount: number
): DashboardStat[] {
  return [
    {
      id: "1",
      label: "Total Projects",
      value: String(projectCount),
      hint: "Across all categories",
    },
    {
      id: "2",
      label: "Total Testimonials",
      value: String(testimonialCount),
      hint: "Published client notes",
    },
    {
      id: "3",
      label: "Total Services",
      value: String(serviceCount),
      hint: "Listed on the site",
    },
  ];
}

export interface QuickAction {
  id: string;
  index: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}

export const quickActions: QuickAction[] = [
  {
    id: "1",
    index: "Q-01",
    title: "Add New Project",
    description: "Create a new project entry with images, category, and description.",
    href: "/admin/projects/new",
    cta: "Add Project",
  },
  {
    id: "2",
    index: "Q-02",
    title: "Add Testimonial",
    description: "Publish a new client quote with name, role, and photo.",
    href: "/admin/testimonials/new",
    cta: "Add Testimonial",
  },
  {
    id: "3",
    index: "Q-03",
    title: "Edit Company Details",
    description: "Update studio address, contact info, and social links.",
    href: "/admin/company-details",
    cta: "Edit Details",
  },
  {
    id: "4",
    index: "Q-04",
    title: "Manage Services",
    description: "Add, edit, or reorder the services listed on the site.",
    href: "/admin/services",
    cta: "Manage Services",
  },
];
