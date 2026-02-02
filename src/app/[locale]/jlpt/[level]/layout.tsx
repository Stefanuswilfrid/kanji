import { ReplaceRouteButton } from "@/components/route-button";
import en from "@/locales/en.json";
import id from "@/locales/id.json";
import { DesktopSidebar } from "@/modules/jlpt/layout/sidebar";

type Locale = "en" | "id";

function getT(locale: Locale) {
  return locale === "en" ? en : id;
}

export default async function JLPTLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; level: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === "en" ? "en" : "id";
  const t = getT(locale);

  return (
    <div className="grow">
      <header className="fixed z-50 top-0 left-0 w-screen h-16 grid place-items-center bg-black border-b border-b-secondary/10">
        <ReplaceRouteButton path={`/${locale}`}>
          <div className="mb-[3px]">&#8592;</div> {t.return}
        </ReplaceRouteButton>
      </header>
      <div className="mx-auto max-w-360 flex gap-1">
        <DesktopSidebar  />
        {children}
      </div>
    </div>
  );
}

