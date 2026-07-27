import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("Index");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold text-primary">{t("title")}</h1>
      <p className="text-muted-foreground text-lg">
        Next.js 15 + i18n + Tailwind
      </p>
    </div>
  );
}
