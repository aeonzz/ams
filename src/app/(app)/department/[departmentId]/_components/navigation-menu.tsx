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
import { H2, P } from "@/components/typography/text";
import { Ellipsis, Menu } from "lucide-react";
import { useDepartmentData } from "@/lib/hooks/use-department-data";
import NavigationMenuSkeleton from "./navigation-menu-skeleton";
import { useMediaQuery } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const management: {
  title: string;
  href: string;
  description: string;
  condition?: boolean;
}[] = [
  {
    title: "User Management",
    href: "users?page=1&per_page=10&sort=createdAt.desc",
    description: "Manage department users and their roles.",
  },
  {
    title: "Supply Management",
    href: "resources/supply-items?page=1&per_page=10&sort=createdAt.desc",
    description: "Track and manage the department's supply inventory.",
    condition: true,
  },
  {
    title: "Managing Job Requests",
    href: "job-request/?page=1&per_page=10&sort=createdAt.desc",
    description: "Oversee job requests and ensure their completion.",
    condition: true,
  },
  {
    title: "Manage Borrowable Items",
    href: "resources/borrowable-items",
    description: "Maintain the list of items available for borrowing.",
    condition: true,
  },
  {
    title: "Venue Request and Management",
    href: "resources/venue?page=1&per_page=10&sort=createdAt.desc",
    description: "Manage venue requests and scheduling.",
    condition: true,
  },
  {
    title: "Transport Request and Vehicle Management",
    href: "resources/transport?page=1&per_page=10&sort=createdAt.desc",
    description: "Handle transport requests and manage vehicles.",
    condition: true,
  },
];

interface OverviewNavigationMenuProps {
  departmentId: string;
}

export default function OverviewNavigationMenu({
  departmentId,
}: OverviewNavigationMenuProps) {
  const isDesktop = useMediaQuery("(min-width: 769px)");
  const pathname = usePathname();
  const { data, isLoading, isError } = useDepartmentData(departmentId);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  if (isLoading) {
    return <NavigationMenuSkeleton />;
  }

  if (isError || !data) {
    return null;
  }

  const {
    managesTransport,
    managesFacility,
    acceptsJobs,
    managesBorrowRequest,
    managesSupplyRequest,
  } = data;

  const managementWithConditions = management
    .filter((item) => item.condition !== false)
    .map((item) => {
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
      if (item.title === "User Management") {
        return { ...item, condition: true };
      }
      return item;
    })
    .filter((item) => item.condition);

  const renderDesktopMenu = () => (
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
                  {manage.condition && (
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

  const renderMobileMenu = () => (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          aria-label="Open navigation menu"
        >
          <Ellipsis className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="overflow-hidden rounded-l-[10px] px-3"
      >
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <nav className="mt-2">
          <ul>
            <li>
              <Link
                href={`/department/${departmentId}/overview`}
                className={cn(
                  "block rounded-md px-4 py-2 font-semibold",
                  pathname === `/department/${departmentId}/overview`
                    ? "bg-secondary-accent"
                    : "hover:bg-secondary"
                )}
                onClick={() => setIsSheetOpen(false)}
              >
                Overview
              </Link>
            </li>
            <li>
              <Accordion type="single" collapsible>
                <AccordionItem value="management">
                  <AccordionTrigger className="px-4 py-3 font-semibold">
                    Management
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="ml-4 space-y-2">
                      {managementWithConditions.map((manage) => (
                        <li key={manage.title}>
                          <Link
                            href={`/department/${departmentId}/${manage.href}`}
                            className="block rounded-md px-4 py-2 font-medium hover:bg-secondary"
                            onClick={() => setIsSheetOpen(false)}
                          >
                            {manage.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </li>
            <li>
              <Link
                href={`/department/${departmentId}/insights`}
                className={cn(
                  "block rounded-md px-4 py-2 font-semibold",
                  pathname === `/department/${departmentId}/insights`
                    ? "bg-secondary-accent"
                    : "hover:bg-secondary"
                )}
                onClick={() => setIsSheetOpen(false)}
              >
                Insights
              </Link>
            </li>
            <li>
              <Link
                href={`/department/${departmentId}/about`}
                className={cn(
                  "block rounded-md px-4 py-2 font-semibold",
                  pathname === `/department/${departmentId}/about`
                    ? "bg-secondary-accent"
                    : "hover:bg-secondary"
                )}
                onClick={() => setIsSheetOpen(false)}
              >
                About
              </Link>
            </li>
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );

  return isDesktop ? renderDesktopMenu() : renderMobileMenu();
}
