import {
  CheckIcon,
  CircleArrowUp,
  Cog,
  Construction,
  FileQuestion,
  Hammer,
  LucideIcon,
  Paintbrush,
  PocketKnife,
  Wrench,
} from "lucide-react";

export type Item = {
  value: string;
  label: string;
};

export type Category = {
  value: string;
  label: string;
  items: Item[];
};

export type Job = {
  value: string;
  label: string;
  icon: LucideIcon;
  categories: Category[];
};

export const jobs: Job[] = [
  {
    value: "repair",
    label: "Repair",
    icon: Wrench,
    categories: [
      {
        value: "electronics",
        label: "Electronics",
        items: [
          { value: "aircon", label: "Aircon" },
          { value: "phone", label: "Phone" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "furniture",
        label: "Furniture",
        items: [
          { value: "table", label: "Table" },
          { value: "chair", label: "Chair" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "other",
        label: "Other",
        items: [{ value: "other", label: "Other" }],
      },
    ],
  },
  {
    value: "maintenance",
    label: "Maintenance",
    icon: Construction,
    categories: [
      {
        value: "building",
        label: "Building",
        items: [
          { value: "hvac", label: "HVAC" },
          { value: "plumbing", label: "Plumbing" },
          { value: "electrical", label: "Electrical" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "vehicle",
        label: "Vehicle",
        items: [
          { value: "car", label: "Car" },
          { value: "motorcycle", label: "Motorcycle" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "other",
        label: "Other",
        items: [
          { value: "car", label: "Car" },
          { value: "motorcycle", label: "Motorcycle" },
          { value: "other", label: "Other" },
        ],
      },
    ],
  },
  {
    value: "installation",
    label: "Installation",
    icon: PocketKnife,
    categories: [
      {
        value: "software",
        label: "Software",
        items: [
          { value: "os", label: "Operating System" },
          { value: "application", label: "Application" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "hardware",
        label: "Hardware",
        items: [
          { value: "computer", label: "Computer" },
          { value: "network", label: "Network Equipment" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "other",
        label: "Other",
        items: [
          { value: "computer", label: "Computer" },
          { value: "network", label: "Network Equipment" },
          { value: "other", label: "Other" },
        ],
      },
    ],
  },
  {
    value: "troubleshooting",
    label: "Troubleshooting",
    icon: FileQuestion,
    categories: [
      {
        value: "software",
        label: "Software",
        items: [
          { value: "bug", label: "Bug" },
          { value: "performance", label: "Performance Issue" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "hardware",
        label: "Hardware",
        items: [
          { value: "malfunction", label: "Malfunction" },
          { value: "connectivity", label: "Connectivity Issue" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "other",
        label: "Other",
        items: [
          { value: "malfunction", label: "Malfunction" },
          { value: "connectivity", label: "Connectivity Issue" },
          { value: "other", label: "Other" },
        ],
      },
    ],
  },
  {
    value: "cleaning",
    label: "Cleaning",
    icon: Paintbrush,
    categories: [
      {
        value: "residential",
        label: "Residential",
        items: [
          { value: "house", label: "House" },
          { value: "apartment", label: "Apartment" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "commercial",
        label: "Commercial",
        items: [
          { value: "office", label: "Office" },
          { value: "retail", label: "Retail Space" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "other",
        label: "Other",
        items: [
          { value: "office", label: "Office" },
          { value: "retail", label: "Retail Space" },
          { value: "other", label: "Other" },
        ],
      },
    ],
  },
  {
    value: "replacement",
    label: "Replacement",
    icon: CircleArrowUp,
    categories: [
      {
        value: "parts",
        label: "Parts",
        items: [
          { value: "electronic", label: "Electronic Components" },
          { value: "mechanical", label: "Mechanical Parts" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "equipment",
        label: "Equipment",
        items: [
          { value: "appliance", label: "Appliance" },
          { value: "machinery", label: "Machinery" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "other",
        label: "Other",
        items: [
          { value: "appliance", label: "Appliance" },
          { value: "machinery", label: "Machinery" },
          { value: "other", label: "Other" },
        ],
      },
    ],
  },
  {
    value: "configuration",
    label: "Configuration",
    icon: Cog,
    categories: [
      {
        value: "network",
        label: "Network",
        items: [
          { value: "router", label: "Router" },
          { value: "switch", label: "Switch" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "software",
        label: "Software",
        items: [
          { value: "server", label: "Server" },
          { value: "database", label: "Database" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "other",
        label: "Other",
        items: [
          { value: "server", label: "Server" },
          { value: "database", label: "Database" },
          { value: "other", label: "Other" },
        ],
      },
    ],
  },
];
