import { ClientComponentT } from "./ClientComponentT";
import { IndexT } from "./IndexT";
import { ServerComponentT } from "./ServerComponentT";

export type FullTranslation = {
  Index: IndexT;
  ServerComponentProps: ServerComponentT;
  ClientComponentProps: ClientComponentT;
};
