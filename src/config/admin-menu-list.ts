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
          active: pathname === "/admin/dashboard",
          icon: LayoutGrid,
          submenus: [],
        },
        {
          href: "/admin/requests?page=1&per_page=10&sort=createdAt.desc",
          label: "Requests",
          active: pathname.includes("/requests"),
          icon: Inbox,
          submenus: [],
        },
      ],
    },
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
          href: "/admin/departments?page=1&per_page=10&sort=createdAt.desc",
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
          href: "/admin/venues?page=1&per_page=10&sort=createdAt.desc",
          label: "Facilities",
          active: pathname.includes("/admin/venues"),
          icon: Building,
          submenus: [],
        },
        {
          href: "/admin/vehicles?page=1&per_page=10&sort=createdAt.desc",
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
