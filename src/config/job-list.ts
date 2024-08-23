import {
  Calendar,
  Camera,
  CheckIcon,
  CircleArrowUp,
  Cog,
  Construction,
  FileQuestion,
  Hammer,
  Laptop,
  Leaf,
  LucideIcon,
  Paintbrush,
  PenTool,
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
        value: "academic",
        label: "Academic Spaces",
        items: [
          { value: "classroom", label: "Classroom" },
          { value: "laboratory", label: "Laboratory" },
          { value: "library", label: "Library" },
          { value: "lecture_hall", label: "Lecture Hall" },
        ],
      },
      {
        value: "residential",
        label: "Residential Areas",
        items: [
          { value: "dorm_room", label: "Dorm Room" },
          { value: "common_area", label: "Common Area" },
          { value: "bathroom", label: "Bathroom" },
          { value: "kitchen", label: "Communal Kitchen" },
        ],
      },
      {
        value: "recreational",
        label: "Recreational Facilities",
        items: [
          { value: "gym", label: "Gymnasium" },
          { value: "sports_field", label: "Sports Field" },
          { value: "student_center", label: "Student Center" },
          { value: "cafeteria", label: "Cafeteria" },
        ],
      },
      {
        value: "outdoor",
        label: "Outdoor Areas",
        items: [
          { value: "walkways", label: "Walkways" },
          { value: "parking_lot", label: "Parking Lot" },
          { value: "green_spaces", label: "Green Spaces" },
          { value: "quad", label: "Quad" },
        ],
      },
      {
        value: "other",
        label: "Other",
        items: [
          { value: "admin_office", label: "Administrative Office" },
          { value: "faculty_lounge", label: "Faculty Lounge" },
          { value: "maintenance_area", label: "Maintenance Area" },
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
  {
    value: "media_production",
    label: "Media Production",
    icon: Camera,
    categories: [
      {
        value: "photography",
        label: "Photography",
        items: [
          { value: "event_photoshoot", label: "Event Photoshoot" },
          { value: "portrait", label: "Portrait Session" },
          { value: "product", label: "Product Photography" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "videography",
        label: "Videography",
        items: [
          { value: "event_coverage", label: "Event Coverage" },
          { value: "promotional_video", label: "Promotional Video" },
          { value: "tutorial", label: "Tutorial Video" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "audio",
        label: "Audio Production",
        items: [
          { value: "podcast", label: "Podcast Recording" },
          { value: "voice_over", label: "Voice Over" },
          { value: "sound_editing", label: "Sound Editing" },
          { value: "other", label: "Other" },
        ],
      },
    ],
  },
  {
    value: "it_support",
    label: "IT Support",
    icon: Laptop,
    categories: [
      {
        value: "software",
        label: "Software",
        items: [
          { value: "application_support", label: "Application Support" },
          { value: "system_update", label: "System Update" },
          { value: "data_recovery", label: "Data Recovery" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "hardware",
        label: "Hardware",
        items: [
          { value: "computer_repair", label: "Computer Repair" },
          { value: "network_setup", label: "Network Setup" },
          { value: "peripheral_setup", label: "Peripheral Setup" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "user_support",
        label: "User Support",
        items: [
          { value: "account_management", label: "Account Management" },
          { value: "software_training", label: "Software Training" },
          { value: "troubleshooting", label: "General Troubleshooting" },
          { value: "other", label: "Other" },
        ],
      },
    ],
  },
  {
    value: "engineering_support",
    label: "Engineering Support",
    icon: PenTool,
    categories: [
      {
        value: "mechanical",
        label: "Mechanical",
        items: [
          { value: "equipment_calibration", label: "Equipment Calibration" },
          { value: "prototype_fabrication", label: "Prototype Fabrication" },
          { value: "machine_maintenance", label: "Machine Maintenance" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "electrical",
        label: "Electrical",
        items: [
          { value: "circuit_design", label: "Circuit Design" },
          {
            value: "power_system_maintenance",
            label: "Power System Maintenance",
          },
          { value: "electronic_repair", label: "Electronic Repair" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "materials",
        label: "Materials",
        items: [
          { value: "material_testing", label: "Material Testing" },
          { value: "sample_preparation", label: "Sample Preparation" },
          { value: "analysis_support", label: "Analysis Support" },
          { value: "other", label: "Other" },
        ],
      },
    ],
  },
  {
    value: "environmental_services",
    label: "Environmental Services",
    icon: Leaf,
    categories: [
      {
        value: "waste_management",
        label: "Waste Management",
        items: [
          { value: "recycling_setup", label: "Recycling Setup" },
          { value: "waste_collection", label: "Waste Collection" },
          { value: "hazardous_material", label: "Hazardous Material Handling" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "energy_efficiency",
        label: "Energy Efficiency",
        items: [
          { value: "energy_audit", label: "Energy Audit" },
          { value: "lighting_upgrade", label: "Lighting Upgrade" },
          { value: "hvac_optimization", label: "HVAC Optimization" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "green_initiatives",
        label: "Green Initiatives",
        items: [
          { value: "tree_planting", label: "Tree Planting" },
          { value: "garden_maintenance", label: "Garden Maintenance" },
          {
            value: "sustainability_workshop",
            label: "Sustainability Workshop",
          },
          { value: "other", label: "Other" },
        ],
      },
    ],
  },
  {
    value: "event_support",
    label: "Event Support",
    icon: Calendar,
    categories: [
      {
        value: "setup",
        label: "Setup",
        items: [
          { value: "stage_assembly", label: "Stage Assembly" },
          { value: "av_equipment", label: "AV Equipment Setup" },
          { value: "seating_arrangement", label: "Seating Arrangement" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "logistics",
        label: "Logistics",
        items: [
          { value: "transportation", label: "Transportation" },
          { value: "catering_coordination", label: "Catering Coordination" },
          { value: "guest_management", label: "Guest Management" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "technical_support",
        label: "Technical Support",
        items: [
          { value: "sound_system", label: "Sound System Operation" },
          { value: "lighting_control", label: "Lighting Control" },
          { value: "live_streaming", label: "Live Streaming" },
          { value: "other", label: "Other" },
        ],
      },
    ],
  },
];
