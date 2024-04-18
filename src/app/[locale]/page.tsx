import ClientComponent from "@/ClientComponent";
import ServerComponent from "@/ServerComponent";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Index({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = useTranslations("Index");
  return (
    <div>
      <h1>{t("title")}</h1>
      <ServerComponent />
      <ClientComponent />
    </div>
  );
}
