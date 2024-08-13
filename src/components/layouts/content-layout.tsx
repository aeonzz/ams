interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <>
      {/* <Navbar title={title} /> */}
      <section className="flex h-full w-full items-center justify-center">
        {children}
      </section>
    </>
  );
}
