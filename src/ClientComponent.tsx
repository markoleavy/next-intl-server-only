"use client";
import Button from "./Button";
import { ClientComponentT } from "../translations/types/ClientComponentT";

const ClientComponent: React.FC<{ translations: ClientComponentT }> = ({
  translations,
}) => {
  return (
    <div>
      <h2>{translations.title}</h2>
      <p>{translations.subtitle}</p>
      <Button translations={translations.button} />
    </div>
  );
};

export default ClientComponent;
