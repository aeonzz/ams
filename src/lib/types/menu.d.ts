type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
  departmentId?: string;
  showNotification?: boolean
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
};
