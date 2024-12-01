import {
  Bell,
  BookOpen,
  Briefcase,
  Building,
  Calendar,
  FolderKanban,
  Hammer,
  HelpCircle,
  Inbox,
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
  const hasValidDepartmentRole = currentUser.userRole.some((userRole) =>
    roles.includes(userRole.role.name)
  );

  const departmentLinks = hasValidDepartmentRole
    ? currentUser.userDepartments
        .filter((userDepartment) => {
          // Check if user has a role in this specific department
          return currentUser.userRole.some(
            (role) =>
              role.departmentId === userDepartment.departmentId &&
              roles.includes(role.role.name)
          );
        })
        .map((userDepartment) => ({
          href: `/department/${userDepartment.departmentId}`,
          label: userDepartment.department.name,
          active: pathname.includes(
            `/department/${userDepartment.departmentId}`
          ),
          icon: Briefcase,
          submenus: [
            {
              href: `/department/${userDepartment.departmentId}/overview`,
              label: "Overview",
              active:
                pathname ===
                `/department/${userDepartment.departmentId}/overview`,
            },
            {
              href: `/department/${userDepartment.departmentId}/requests/pending?page=1&per_page=10&sort=createdAt.desc`,
              label: "Pending Requests",
              active:
                pathname ===
                `/department/${userDepartment.departmentId}/requests/pending`,
            },
          ],
        }))
    : [];

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
        // ...(isPersonnel
        //   ? [
        //       {
        //         href: "/job-requests",
        //         label: "My Job Requests",
        //         active: pathname.includes("/job-request"),
        //         icon: Hammer,
        //         submenus: [],
        //       },
        //     ]
        //   : []),
      ],
    },
    ...(departmentLinks.length > 0
      ? [
          {
            groupLabel: "Your Departments",
            menus: departmentLinks,
          },
        ]
      : []),
    {
      groupLabel: "Requests",
      menus: [
        {
          href: "/requests",
          label: "My Requests",
          active: pathname.includes("/requests"),
          icon: Inbox,
          submenus: [
            {
              href: "/request/my-requests?page=1&per_page=10&sort=createdAt.desc",
              label: "Requests",
              active: pathname.includes(`/request/my-requests`),
            },
            {
              href: "/request/cancelled?page=1&per_page=10&sort=createdAt.desc",
              label: "Cancelled Requests",
              active: pathname.includes(`/request/cancelled`),
            },
          ],
        },
        // {
        //   href: "/reservation/my-reservations",
        //   label: "Reservations",
        //   active: pathname.includes("/reservations"),
        //   icon: Calendar,
        //   submenus: [
        //     {
        //       href: "/reservations/my-reservations",
        //       label: "All Reservations",
        //       active: pathname === "/reservations/my-reservations",
        //     },
        //   ],
        // },
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
          href: "/settings/account",
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
