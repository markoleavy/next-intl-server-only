import ClientComponent from "@/ClientComponent";
import ServerComponent from "@/ServerComponent";
import { localize } from "@/localize";
import { unstable_setRequestLocale } from "next-intl/server";
import { IndexT } from "../../../translations/types/IndexT";
import { ClientComponentT } from "../../../translations/types/ClientComponentT";

export default async function Index({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const indexTranslations = await localize({
    namespace: "Index",
    TranslationClass: IndexT,
  });
  const clientTranslations = await localize({
    namespace: "ClientComponentProps",
    TranslationClass: ClientComponentT,
  });
  return (
    <div>
      <h1>{indexTranslations.title}</h1>
      <ServerComponent />
      <ClientComponent translations={clientTranslations} />
    </div>
  );
}
