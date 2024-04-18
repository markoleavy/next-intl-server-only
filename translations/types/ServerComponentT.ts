import { Translation } from "./Translation";

export class ServerComponentT implements Translation {
  constructor() {}
  title = "";
  subtitle = "";
  button = {
    cta: "",
    link: "",
  };
}
