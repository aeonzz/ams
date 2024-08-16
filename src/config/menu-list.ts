import {
  Bell,
  BookOpen,
  Briefcase,
  Building,
  Calendar,
  HelpCircle,
  LayoutGrid,
  Mails,
  Settings,
  Truck,
} from "lucide-react";

import { Group } from "@/lib/types/menu";

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
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
      groupLabel: "My Requests & Reservations",
      menus: [
        {
          href: "/my-requests",
          label: "Requests",
          active: pathname.includes("/my-requests"),
          icon: Mails,
          submenus: [
            {
              href: "/my-requests",
              label: "All Requests",
              active: pathname === "/my-requests",
            },
            {
              href: "/my-requests/new",
              label: "New Request",
              active: pathname === "/my-requests/new",
            },
          ],
        },
        {
          href: "/my-reservations",
          label: "Reservations",
          active: pathname.includes("/my-reservations"),
          icon: Calendar,
          submenus: [
            {
              href: "/my-reservations",
              label: "All Reservations",
              active: pathname === "/my-reservations",
            },
            {
              href: "/my-reservations/new",
              label: "New Reservation",
              active: pathname === "/my-reservations/new",
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Resources",
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
      groupLabel: "Preferences",
      menus: [
        {
          href: "/settings/profile",
          label: "Settings",
          active: pathname.includes("/settings"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Help & Support",
      menus: [
        {
          href: "/help",
          label: "Help & Support",
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
          ],
        },
      ],
    },
  ];
}
