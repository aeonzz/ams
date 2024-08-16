import {
  LayoutGrid,
  Bell,
  Mails,
  Calendar,
  Settings,
  HelpCircle,
  Users,
  FileText,
  Building,
  Briefcase,
  BookOpen,
  Truck,
  BarChart,
  ShieldAlert,
  Wrench,
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
          active: pathname.includes("/admin"),
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
          icon: Mails,
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
          href: "/users",
          label: "User Accounts",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: [
            {
              href: "/users/students",
              label: "Student Accounts",
              active: pathname === "/users/students",
            },
            {
              href: "/users/faculty",
              label: "Faculty Accounts",
              active: pathname === "/users/faculty",
            },
            {
              href: "/users/staff",
              label: "Staff Accounts",
              active: pathname === "/users/staff",
            },
          ],
        },
        {
          href: "/roles",
          label: "Role Management",
          active: pathname.includes("/roles"),
          icon: ShieldAlert,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Asset Management",
      menus: [
        {
          href: "/facilities",
          label: "Facilities",
          active: pathname.includes("/facilities"),
          icon: Building,
          submenus: [],
        },
        {
          href: "/equipment",
          label: "Equipment",
          active: pathname.includes("/equipment"),
          icon: Briefcase,
          submenus: [],
        },
        {
          href: "/materials",
          label: "Materials",
          active: pathname.includes("/materials"),
          icon: BookOpen,
          submenus: [],
        },
        {
          href: "/vehicles",
          label: "Vehicles",
          active: pathname.includes("/vehicles"),
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
              href: "/reports/financial",
              label: "Financial Reports",
              active: pathname === "/reports/financial",
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
              href: "/settings/integrations",
              label: "Integrations",
              active: pathname === "/settings/integrations",
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
              href: "/help/documentation",
              label: "System Documentation",
              active: pathname === "/help/documentation",
            },
          ],
        },
      ],
    },
  ];
}
