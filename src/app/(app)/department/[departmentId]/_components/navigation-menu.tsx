"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";
import { P } from "@/components/typography/text";
import type { DepartmentWithRelations } from "prisma/generated/zod";
import { BarChartIcon, Circle } from "lucide-react";

const management: {
  title: string;
  href: string;
  description: string;
  condition?: boolean;
}[] = [
  {
    title: "User Management",
    href: "users?page=1&per_page=10&sort=createdAt.desc",
    description:
      "Manage department users. Control roles and permissions tailored to departmental needs.",
  },
  {
    title: "Pending Requests",
    href: "requests/pending?page=1&per_page=10&sort=createdAt.desc",
    description:
      "View and manage all pending requests within the department. Ensure timely follow-up and resolution of outstanding requests.",
  },
  {
    title: "Request History",
    href: "/management/request-history",
    description:
      "Access a record of all requests submitted by the department. Track progress, status changes, and outcomes for accountability.",
  },
  {
    title: "Request Escalations",
    href: "/management/request-escalations",
    description:
      "Manage escalations for urgent requests within the department. Prioritize critical tasks and ensure they are addressed promptly.",
  },
  {
    title: "Facilities Management",
    href: "facilities?page=1&per_page=10&sort=createdAt.desc",
    description:
      "Manage department facilities, ensuring that resources are available and properly maintained for effective operations.",
    condition: true,
  },
  {
    title: "Transport Services",
    href: "transport?page=1&per_page=10&sort=createdAt.desc",
    description:
      "Coordinate transport services for the department, managing vehicle assignments, schedules, and user requests.",
    condition: true,
  },
];

const resources: { title: string; href: string; description: string }[] = [
  {
    title: "Job Requests",
    href: "/department/job-requests",
    description:
      "View and manage job requests assigned to your department. Track progress and updates.",
  },
  {
    title: "Transport Requests",
    href: "/department/transport-requests",
    description:
      "Manage vehicle and transport requests for departmental use or official travel.",
  },
  {
    title: "Inventory Management",
    href: "/department/inventory",
    description:
      "Track, add, and update inventory items belonging to your department. Manage resources efficiently.",
  },
  {
    title: "Returnable Items",
    href: "/department/returnable-items",
    description:
      "Manage and track items that have been loaned out and are expected to be returned.",
  },
];

interface OverviewNavigationMenuProps {
  data: DepartmentWithRelations;
}

export default function OverviewNavigationMenu({
  data,
}: OverviewNavigationMenuProps) {
  const pathname = usePathname();
  const { id: departmentId, managesTransport, managesFacility } = data;

  const managementWithConditions = management.map((item) => {
    if (item.title === "Transport Services") {
      return { ...item, condition: managesTransport };
    }
    if (item.title === "Facilities Management") {
      return { ...item, condition: managesFacility };
    }
    return item;
  });

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link
            href={`/department/${departmentId}/overview`}
            legacyBehavior
            passHref
            prefetch
          >
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                pathname === `/department/${departmentId}/overview` &&
                  "bg-secondary-accent"
              )}
            >
              Overview
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <P>Management</P>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {managementWithConditions.map((manage) => (
                <li key={manage.title}>
                  {manage.condition === false ? (
                    <div
                      className={cn(
                        "block cursor-not-allowed select-none space-y-1 rounded-md p-3 leading-none opacity-50 outline-none transition-colors"
                      )}
                    >
                      <div className="text-sm font-medium leading-none">
                        {manage.title}
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {manage.description}
                      </p>
                    </div>
                  ) : (
                    <Link
                      href={`/department/${departmentId}/${manage.href}`}
                      legacyBehavior
                      passHref
                      prefetch
                    >
                      <NavigationMenuLink
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-secondary-accent hover:text-secondary-accent-foreground focus:bg-secondary-accent focus:text-secondary-accent-foreground"
                        )}
                      >
                        <div className="text-sm font-medium leading-none">
                          {manage.title}
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {manage.description}
                        </p>
                      </NavigationMenuLink>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <P>Resources</P>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <Link
                href={`/department/${departmentId}/insights`}
                prefetch
                className="row-span-4"
              >
                <NavigationMenuLink className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/50 to-primary p-6 no-underline outline-none focus:shadow-md">
                  <BarChartIcon className="h-6 w-6" />
                  <div className="mb-2 mt-4 text-lg font-medium">
                    Department Insights
                  </div>
                  <p className="text-sm leading-tight text-muted-foreground">
                    Gain valuable insights into department performance, request
                    volume, and resource usage. Monitor key metrics and
                    visualize data for better decision-making and optimization.
                  </p>
                </NavigationMenuLink>
              </Link>
              {resources.map((resource) => (
                <Link
                  key={resource.title}
                  href={`/department/${departmentId}/${resource.href}`}
                  legacyBehavior
                  passHref
                  prefetch
                >
                  <NavigationMenuLink
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-secondary-accent hover:text-secondary-accent-foreground focus:bg-secondary-accent focus:text-secondary-accent-foreground"
                    )}
                  >
                    <div className="text-sm font-medium leading-none">
                      {resource.title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      {resource.description}
                    </p>
                  </NavigationMenuLink>
                </Link>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            href={`/department/${departmentId}/about`}
            legacyBehavior
            passHref
            prefetch
          >
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                pathname === `/department/${departmentId}/about` &&
                  "bg-secondary-accent"
              )}
            >
              About
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
