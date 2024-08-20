import SettingsMenu from "./settings-menu";
import { P } from "../../../../components/typography/text";
import { Separator } from "../../../../components/ui/separator";

interface SettingsLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function SettingsLayout({
  title,
  children,
}: SettingsLayoutProps) {
  return (
    <section className="h-full w-full">
      <div className="flex-1">
        <div className="flex h-[50px] items-center border-b px-3">
          <P className="font-medium">Settings</P>
        </div>
      </div>
      <div className="flex h-full px-12 py-6">
        <SettingsMenu />
        {children}
      </div>
    </section>
  );
}
