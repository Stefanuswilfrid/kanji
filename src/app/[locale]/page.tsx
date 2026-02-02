import Home from "@/app/page";
import { notFound } from "next/navigation";

type Locale = "en" | "id";

export const dynamicParams = false;

export async function generateStaticParams() {
  const locales: Locale[] = ["en", "id"];
  return locales.map((locale) => ({ locale }));
}

function isLocale(value: string): value is Locale {
  return value === "en" || value === "id";
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <Home />;
}

