import { Translation } from "./Translation";

export class ClientComponentT implements Translation {
  constructor() {}
  title = "";
  subtitle = "";
  button = {
    cta: "",
    link: "",
  };
}

