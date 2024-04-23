import Link from "next/link";
import React, { useEffect } from "react";
import { ClientComponentClass } from "../translations/types/ClientComponent";

const Button: React.FC<{ translations: ClientComponentClass["button"] }> = ({
  translations: { link, cta },
}) => {
  return (
    <Link href={link}>
      <button>{cta}</button>
    </Link>
  );
};

export default Button;
