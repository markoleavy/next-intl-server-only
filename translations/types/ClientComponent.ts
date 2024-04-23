import { FullTranslation } from "./FullTranslation";
import { Translation } from "./Translation";

export class ClientComponentClass implements Translation {
  namespace?: keyof FullTranslation = "ClientComponentProps";
  constructor() {}
  title = "";
  subtitle = "";
  button = {
    cta: "",
    link: "",
  };
}
