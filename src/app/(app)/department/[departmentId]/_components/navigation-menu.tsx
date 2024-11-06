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
import { useDepartmentData } from "@/lib/hooks/use-department-data";
import FetchDataError from "@/components/card/fetch-data-error";
import NavigationMenuSkeleton from "./navigation-menu-skeleton";

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
    title: "Supply Management",
    href: "resources/supply-items?page=1&per_page=10&sort=createdAt.desc",
    description:
      "Oversee the department’s supply inventory. Track stock levels, manage supply requests, and ensure timely replenishment of critical items.",
    condition: true,
  },
  {
    title: "Managing Job Requests",
    href: "job-requests",
    description:
      "Manage all job requests submitted by the department. Track progress, assign tasks, and ensure job completion.",
    condition: true,
  },
  {
    title: "Manage Borrowable Items",
    href: "resources/borrowable-items",
    description:
      "Manage the list of items available for borrowing within your department. Add, update, or remove items to ensure accurate inventory for borrowing requests.",
    condition: true,
  },
  {
    title: "Facilities Management",
    href: "resources/facilities",
    description:
      "Manage department facilities, ensuring that resources are available and properly maintained for effective operations.",
    condition: true,
  },
  {
    title: "Transport Services",
    href: "resources/transport?page=1&per_page=10&sort=createdAt.desc",
    description:
      "Coordinate transport services for the department, managing vehicle assignments, schedules, and user requests.",
    condition: true,
  },
];

interface OverviewNavigationMenuProps {
  departmentId: string;
}

export default function OverviewNavigationMenu({
  departmentId,
}: OverviewNavigationMenuProps) {
  const pathname = usePathname();
  const { data, isLoading, isError, refetch } = useDepartmentData(departmentId);

  if (isLoading) {
    return <NavigationMenuSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <FetchDataError refetch={refetch} />
      </div>
    );
  }

  const {
    managesTransport,
    managesFacility,
    acceptsJobs,
    managesBorrowRequest,
    managesSupplyRequest,
  } = data;

  const managementWithConditions = management.map((item) => {
    if (item.title === "Transport Services") {
      return { ...item, condition: managesTransport };
    }
    if (item.title === "Facilities Management") {
      return { ...item, condition: managesFacility };
    }
    if (item.title === "Managing Job Requests") {
      return { ...item, condition: acceptsJobs };
    }
    if (item.title === "Manage Borrowable Items") {
      return { ...item, condition: managesBorrowRequest };
    }
    if (item.title === "Supply Management") {
      return { ...item, condition: managesSupplyRequest };
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
          <Link
            href={`/department/${departmentId}/insights`}
            legacyBehavior
            passHref
            prefetch
          >
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                pathname === `/department/${departmentId}/insights` &&
                  "bg-secondary-accent"
              )}
            >
              Insights
            </NavigationMenuLink>
          </Link>
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
