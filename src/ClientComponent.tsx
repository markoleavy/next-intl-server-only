"use client";
import Button from "./Button";
import { ClientComponentClass } from "../translations/types/ClientComponent";

const ClientComponent: React.FC<{ translations: ClientComponentClass }> = ({
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
