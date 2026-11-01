import type { NavItem } from "@/components/nav-links";

/** The Web Studio sidebar, grouped as in the legacy CMS layout. */
export const CMS_NAV: NavItem[] = [
  { group: "Overview", label: "Dashboard", href: "/cms", icon: "📊" },
  { group: "Content", label: "Pages", href: "/cms/pages", icon: "📄" },
  { group: "Content", label: "Services", href: "/cms/services", icon: "🧩" },
  { group: "Content", label: "Features", href: "/cms/features", icon: "⭐" },
  { group: "Content", label: "Testimonials", href: "/cms/testimonials", icon: "💬" },
  { group: "Content", label: "FAQs", href: "/cms/faqs", icon: "❓" },
  { group: "Content", label: "Team", href: "/cms/team", icon: "👔" },
  { group: "Blog", label: "Posts", href: "/cms/posts", icon: "✍️" },
  { group: "Blog", label: "Success Stories", href: "/cms/posts?category=success-stories", icon: "🏆" },
  { group: "Blog", label: "Categories", href: "/cms/categories", icon: "🗂️" },
  { group: "Site", label: "Site Images", href: "/cms/images", icon: "🖼️" },
  { group: "Site", label: "Menus", href: "/cms/menus", icon: "☰" },
  { group: "Site", label: "Social Links", href: "/cms/social", icon: "🔗" },
  { group: "Site", label: "Media", href: "/cms/media", icon: "🎞️" },
  { group: "Leads", label: "Demo Requests", href: "/cms/demos", icon: "📅" },
  { group: "Leads", label: "Contact Messages", href: "/cms/contacts", icon: "📥" },
  { group: "Leads", label: "Newsletter", href: "/cms/subscribers", icon: "📰" },
  { group: "Configure", label: "Global Settings", href: "/cms/settings", icon: "⚙️" },
];
