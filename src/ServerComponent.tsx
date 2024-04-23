import Button from "./Button";
import { localize } from "./localize";
import { ServerComponentClass } from "../translations/types/ServerComponentT";

const ServerComponent: React.FC = async () => {
  const translations = await localize(ServerComponentClass);
  return (
    <div>
      <h2>{translations.title}</h2>
      <p>{translations.subtitle}</p>
      <Button translations={translations.button} />
    </div>
  );
};

export default ServerComponent;
