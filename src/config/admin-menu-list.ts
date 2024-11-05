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
  Inbox,
} from "lucide-react";

import { Group } from "@/lib/types/menu";

export function getAdminMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "Overview",
      menus: [
        {
          href: "/admin/dashboard",
          label: "Dashboard",
          active: pathname === "/admin",
          icon: LayoutGrid,
          submenus: [],
        },
        {
          href: "/admin/requests",
          label: "Requests",
          active: pathname.includes("/requests"),
          icon: Inbox,
          submenus: [],
        },
      ],
    },
    // {
    //   groupLabel: "Resource Management",
    //   menus: [
    //     {
    //       href: "/requests",
    //       label: "Request Management",
    //       active: pathname.includes("/requests"),
    //       icon: ClipboardList,
    //       submenus: [
    //         {
    //           href: "/requests/pending",
    //           label: "Pending Requests",
    //           active: pathname === "/requests/pending",
    //         },
    //         {
    //           href: "/requests/approved",
    //           label: "Approved Requests",
    //           active: pathname === "/requests/approved",
    //         },
    //         {
    //           href: "/requests/rejected",
    //           label: "Rejected Requests",
    //           active: pathname === "/requests/rejected",
    //         },
    //       ],
    //     },
    //     {
    //       href: "/reservations",
    //       label: "Reservation Management",
    //       active: pathname.includes("/reservations"),
    //       icon: Calendar,
    //       submenus: [
    //         {
    //           href: "/reservations/pending",
    //           label: "Pending Reservations",
    //           active: pathname === "/reservations/pending",
    //         },
    //         {
    //           href: "/reservations/approved",
    //           label: "Approved Reservations",
    //           active: pathname === "/reservations/approved",
    //         },
    //         {
    //           href: "/reservations/rejected",
    //           label: "Rejected Reservations",
    //           active: pathname === "/reservations/rejected",
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      groupLabel: "User Management",
      menus: [
        {
          href: "/admin/users?page=1&per_page=10&sort=createdAt.desc",
          label: "User Accounts",
          active: pathname.includes("/admin/users"),
          icon: Users,
          submenus: [],
        },
        {
          href: "/admin/departments",
          label: "Departments",
          active: pathname.includes("/admin/departments"),
          icon: Briefcase,
          submenus: [],
        },
        {
          href: "/admin/role-management?page=1&per_page=10&sort=createdAt.desc",
          label: "Role Management",
          active: pathname.includes("/admin/role-management"),
          icon: ShieldAlert,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Resource Management",
      menus: [
        {
          href: "/admin/venues",
          label: "Facilities",
          active: pathname.includes("/admin/venues"),
          icon: Building,
          submenus: [],
        },
        {
          href: "/admin/vehicles",
          label: "Vehicles",
          active: pathname.includes("/admin/vehicles"),
          icon: Truck,
          submenus: [],
        },
        {
          href: "/admin/inventory",
          label: "Inventory",
          active: pathname.includes("/admin/inventory"),
          icon: Briefcase,
          submenus: [
            {
              href: "/admin/inventory/lendable-items?page=1&per_page=10&sort=createdAt.desc",
              label: "Lendable Items",
              active: pathname === "/admin/inventory/lendable-items",
            },
            {
              href: "/admin/inventory/supply-items?page=1&per_page=10&sort=createdAt.desc",
              label: "Supply Items",
              active: pathname === "/admin/inventory/supply-items",
            },
          ],
        },
      ],
    },
    // {
    //   groupLabel: "Reports",
    //   menus: [
    //     {
    //       href: "/reports",
    //       label: "Reports & Analytics",
    //       active: pathname.includes("/reports"),
    //       icon: BarChart,
    //       submenus: [
    //         {
    //           href: "/reports/usage",
    //           label: "Resource Usage",
    //           active: pathname === "/reports/usage",
    //         },
    //         {
    //           href: "/reports/trends",
    //           label: "Request Trends",
    //           active: pathname === "/reports/trends",
    //         },
    //         {
    //           href: "/reports/inventory",
    //           label: "Inventory Reports",
    //           active: pathname === "/reports/inventory",
    //         },
    //       ],
    //     },
    //   ],
    // },
  ];
}
