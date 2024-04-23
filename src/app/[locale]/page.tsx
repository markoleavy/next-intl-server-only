import ClientComponent from "@/ClientComponent";
import ServerComponent from "@/ServerComponent";
import { localize } from "@/localize";
import { unstable_setRequestLocale } from "next-intl/server";
import { IndexClass } from "../../../translations/types/Index";
import { ClientComponentClass } from "../../../translations/types/ClientComponent";

export default async function Index({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const indexTranslations = await localize(IndexClass);
  const clientTranslations = await localize(ClientComponentClass);
  return (
    <div>
      <h1>{indexTranslations.title}</h1>
      <ServerComponent />
      <ClientComponent translations={clientTranslations} />
    </div>
  );
}
