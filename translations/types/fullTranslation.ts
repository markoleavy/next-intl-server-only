import { ClientComponentClass } from "./ClientComponent";
import { IndexClass } from "./Index";
import { ServerComponentClass } from "./ServerComponentT";

export type FullTranslation = {
  Index: IndexClass;
  ServerComponentProps: ServerComponentClass;
  ClientComponentProps: ClientComponentClass;
};
