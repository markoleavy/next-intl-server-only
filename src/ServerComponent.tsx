import Button from "./Button";
import { localize } from "./localize";
import { ServerComponentT } from "../translations/types/ServerComponentT";

const ServerComponent: React.FC = async () => {
  const translations = await localize({
    namespace: "ServerComponentProps",
    TranslationClass: ServerComponentT,
  });
  return (
    <div>
      <h2>{translations.title}</h2>
      <p>{translations.subtitle}</p>
      <Button translations={translations.button} />
    </div>
  );
};

export default ServerComponent;
