import { FullTranslation } from "./FullTranslation";
import { Translation } from "./Translation";

export class IndexClass implements Translation {
  namespace?: keyof FullTranslation = "Index";
  constructor() {}
  title = "";
}
