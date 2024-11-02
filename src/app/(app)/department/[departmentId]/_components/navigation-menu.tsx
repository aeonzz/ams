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

const insights: { title: string; href: string; description: string }[] = [
  {
    title: "Borrow Service",
    href: "overview/borrow",
    description:
      "Get a comprehensive overview of all borrow requests made by your department. Analyze trends and borrowing patterns.",
  },
  {
    title: "Borrow Requests Insights",
    href: "/department/borrow-requests/insights",
    description:
      "Dive deeper into the data of borrow requests. Explore metrics, user engagement, and item demand.",
  },
  {
    title: "Pending Borrow Requests",
    href: "/department/borrow-requests/pending",
    description:
      "View all pending borrow requests. Ensure timely processing and resolution of outstanding requests.",
  },
  {
    title: "Borrowing Policy Review",
    href: "/department/borrow-requests/policy",
    description:
      "Review the current borrowing policies and guidelines for your department. Ensure compliance and effective resource management.",
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
          <NavigationMenuTrigger>
            <P>Insights</P>
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
              {insights.map((insight) => (
                <Link
                  key={insight.title}
                  href={`/department/${departmentId}/${insight.href}`}
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
                      {insight.title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      {insight.description}
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
