import { FullTranslation } from "./types/fullTranslation";

const en: FullTranslation = {
  Index: {
    title: "This is a demo page for next-intl",
  },
  ServerComponentProps: {
    title: "This is a server component",
    subtitle:
      "The javascript of this component is exectued server-side and not sent to the browser",
    button: {
      cta: "Click here to view this page in Italian",
      link: "/it",
    },
  },
  ClientComponentProps: {
    title: "This is a client component",
    subtitle:
      "The javascript of this component is sent and executed in the browser",
    button: {
      cta: "Click here to view this page in Italian",
      link: "/it",
    },
  },
};
export default en;
