interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function SettingsLayout({ title, children }: ContentLayoutProps) {
  return <section className="flex w-full px-7 py-5">{children}</section>;
}
