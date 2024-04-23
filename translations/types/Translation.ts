import { FullTranslation } from "./FullTranslation";

export interface Translation {
  namespace?: keyof FullTranslation;
}
