import {
  LayoutGrid,
  Bell,
  Calendar,
  Settings,
  HelpCircle,
  Users,
  Building,
  Briefcase,
  BookOpen,
  Truck,
  BarChart,
  ShieldAlert,
  Wrench,
  GraduationCap,
  ClipboardList,
  FileText,
} from "lucide-react";

import { Group } from "@/lib/types/menu";

export function getAdminMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "Overview",
      menus: [
        {
          href: "/admin",
          label: "Dashboard",
          active: pathname === "/admin",
          icon: LayoutGrid,
          submenus: [],
        },
        {
          href: "/notification",
          label: "Notifications",
          active: pathname.includes("/notification"),
          icon: Bell,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Resource Management",
      menus: [
        {
          href: "/requests",
          label: "Request Management",
          active: pathname.includes("/requests"),
          icon: ClipboardList,
          submenus: [
            {
              href: "/requests/pending",
              label: "Pending Requests",
              active: pathname === "/requests/pending",
            },
            {
              href: "/requests/approved",
              label: "Approved Requests",
              active: pathname === "/requests/approved",
            },
            {
              href: "/requests/rejected",
              label: "Rejected Requests",
              active: pathname === "/requests/rejected",
            },
          ],
        },
        {
          href: "/reservations",
          label: "Reservation Management",
          active: pathname.includes("/reservations"),
          icon: Calendar,
          submenus: [
            {
              href: "/reservations/pending",
              label: "Pending Reservations",
              active: pathname === "/reservations/pending",
            },
            {
              href: "/reservations/approved",
              label: "Approved Reservations",
              active: pathname === "/reservations/approved",
            },
            {
              href: "/reservations/rejected",
              label: "Rejected Reservations",
              active: pathname === "/reservations/rejected",
            },
          ],
        },
      ],
    },
    {
      groupLabel: "User Management",
      menus: [
        {
          href: "/admin/users",
          label: "User Accounts",
          active: pathname.includes("/admin/users"),
          icon: Users,
          submenus: [],
        },
        {
          href: "/admin/departments",
          label: "Departments",
          active: pathname.includes("/admin/departments"),
          icon: GraduationCap,
          submenus: [],
        },
        {
          href: "/admin/role-management",
          label: "Role Management",
          active: pathname.includes("/admin/role-management"),
          icon: ShieldAlert,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Asset Management",
      menus: [
        {
          href: "/admin/venues",
          label: "Facilities",
          active: pathname.includes("/admin/venues"),
          icon: Building,
          submenus: [],
        },
        {
          href: "/admin/inventory",
          label: "Inventory",
          active: pathname.includes("/admin/inventory"),
          icon: Briefcase,
          submenus: [],
        },
        {
          href: "/admin/job-sections",
          label: "Job Sections",
          active: pathname.includes("/admin/job-sections"),
          icon: BookOpen,
          submenus: [],
        },
        {
          href: "/admin/vehicles",
          label: "Vehicles",
          active: pathname.includes("/admin/vehicles"),
          icon: Truck,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Reports",
      menus: [
        {
          href: "/reports",
          label: "Reports & Analytics",
          active: pathname.includes("/reports"),
          icon: BarChart,
          submenus: [
            {
              href: "/reports/usage",
              label: "Resource Usage",
              active: pathname === "/reports/usage",
            },
            {
              href: "/reports/trends",
              label: "Request Trends",
              active: pathname === "/reports/trends",
            },
            {
              href: "/reports/inventory",
              label: "Inventory Reports",
              active: pathname === "/reports/inventory",
            },
          ],
        },
      ],
    },
    {
      groupLabel: "System Administration",
      menus: [
        {
          href: "/settings",
          label: "System Settings",
          active: pathname.includes("/settings"),
          icon: Settings,
          submenus: [
            {
              href: "/settings/general",
              label: "General Settings",
              active: pathname === "/settings/general",
            },
            {
              href: "/settings/security",
              label: "Security Settings",
              active: pathname === "/settings/security",
            },
            {
              href: "/settings/notifications",
              label: "Notification Settings",
              active: pathname === "/settings/notifications",
            },
          ],
        },
        {
          href: "/maintenance",
          label: "System Maintenance",
          active: pathname.includes("/maintenance"),
          icon: Wrench,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Help & Support",
      menus: [
        {
          href: "/help",
          label: "Help Center",
          active: pathname.includes("/help"),
          icon: HelpCircle,
          submenus: [
            {
              href: "/help/faq",
              label: "FAQ",
              active: pathname === "/help/faq",
            },
            {
              href: "/help/contact",
              label: "Contact Support",
              active: pathname === "/help/contact",
            },
            {
              href: "/help/user-manual",
              label: "User Manual",
              active: pathname === "/help/user-manual",
            },
          ],
        },
        {
          href: "/policies",
          label: "Policies & Procedures",
          active: pathname.includes("/policies"),
          icon: FileText,
          submenus: [],
        },
      ],
    },
  ];
}
