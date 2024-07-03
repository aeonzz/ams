export function getSettingsList(pathname: string): Group[] {
  return [
    {
      groupLabel: 'My Account',
      menus: [
        {
          href: '/settings/account',
          label: 'Account',
          active: pathname.includes('/account'),
          icon: '',
          submenus: [],
        },
        {
          href: '/settings/appearance',
          label: 'Appearance',
          active: pathname.includes('/appearance'),
          icon: '',
          submenus: [],
        },
      ],
    },
  ];
}
