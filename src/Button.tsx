import Link from "next/link";
import React, { useEffect } from "react";
import { ClientComponentT } from "../translations/types/ClientComponentT";

const Button: React.FC<{ translations: ClientComponentT["button"] }> = ({
  translations: { link, cta },
}) => {
  return (
    <Link href={link}>
      <button>{cta}</button>
    </Link>
  );
};

export default Button;
