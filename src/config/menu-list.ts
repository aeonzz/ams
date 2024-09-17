import {
  Bell,
  BookOpen,
  Briefcase,
  Building,
  Calendar,
  FolderKanban,
  HelpCircle,
  LayoutGrid,
  Mails,
  Settings,
  Truck,
} from "lucide-react";

import { Group } from "@/lib/types/menu";
import { type UserWithRelations } from "prisma/generated/zod";

type MenuListProps = {
  pathname: string;
  roles: string[];
  currentUser: UserWithRelations;
};

export function getMenuList({
  pathname,
  roles,
  currentUser,
}: MenuListProps): Group[] {
  const { userRole } = currentUser;
  const hasAllowedRole = userRole.some((role) =>
    roles.includes(role.role.name)
  );

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
    ...(hasAllowedRole
      ? [
          {
            groupLabel: "Manage Department Resources",
            menus: [
              {
                href: "",
                label: "Requests",
                active: pathname.includes("/requests/manage/pending"),
                icon: FolderKanban,
                submenus: [
                  {
                    href: "/requests/manage/pending?page=1&per_page=10&sort=createdAt.desc",
                    label: "Pending Requests",
                    active: pathname === "/requests/manage/pending",
                  },
                ],
              },
            ],
          },
        ]
      : []),
    {
      groupLabel: "My Requests & Reservations",
      menus: [
        {
          href: "/requests",
          label: "My Requests",
          active: pathname.includes("/requests"),
          icon: Mails,
          submenus: [
            {
              href: "/requests/my-requests?page=1&per_page=10&sort=createdAt.desc",
              label: "Requests",
              active: pathname === "/requests/my-requests",
            },
            {
              href: "/requests/cancelled",
              label: "Cancelled Requests",
              active: pathname === "/requests/cancelled",
            },
          ],
        },
        {
          href: "/reservation/my-reservations",
          label: "Reservations",
          active: pathname.includes("/reservations"),
          icon: Calendar,
          submenus: [
            {
              href: "/reservations/my-reservations",
              label: "All Reservations",
              active: pathname === "/reservations/my-reservations",
            },
          ],
        },
      ],
    },
    // {
    //   groupLabel: "Resources",
    //   menus: [
    //     {
    //       href: "/facilities",
    //       label: "Facilities",
    //       active: pathname.includes("/facilities"),
    //       icon: Building,
    //       submenus: [],
    //     },
    //     {
    //       href: "/equipment",
    //       label: "Equipment",
    //       active: pathname.includes("/equipment"),
    //       icon: Briefcase,
    //       submenus: [],
    //     },
    //     {
    //       href: "/materials",
    //       label: "Materials",
    //       active: pathname.includes("/materials"),
    //       icon: BookOpen,
    //       submenus: [],
    //     },
    //     {
    //       href: "/vehicles",
    //       label: "Vehicles",
    //       active: pathname.includes("/vehicles"),
    //       icon: Truck,
    //       submenus: [],
    //     },
    //   ],
    // },
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
    // {
    //   groupLabel: "Help & Support",
    //   menus: [
    //     {
    //       href: "/help",
    //       label: "Help & Support",
    //       active: pathname.includes("/help"),
    //       icon: HelpCircle,
    //       submenus: [
    //         {
    //           href: "/help/faq",
    //           label: "FAQ",
    //           active: pathname === "/help/faq",
    //         },
    //         {
    //           href: "/help/contact",
    //           label: "Contact Support",
    //           active: pathname === "/help/contact",
    //         },
    //       ],
    //     },
    //   ],
    // },
  ];
}
