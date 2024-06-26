import { FullTranslation } from "./FullTranslation";
import { Translation } from "./Translation";

export class ServerComponentClass implements Translation {
  namespace?: keyof FullTranslation = "ServerComponentProps";
  constructor() {}
  title = "";
  subtitle = "";
  button = {
    cta: "",
    link: "",
  };
}
