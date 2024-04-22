import { getTranslations } from "next-intl/server";
import type { Translation } from "../translations/types/Translation";
import { FullTranslation } from "../translations/types/FullTranslation";
type TranslationGettter = {
  key: string;
  getter: string | TranslationGettter[];
};
// recursively maps <T> default fields and subfields, returning an array of objects with a key and a getter.
// Example:
// [
//   { key: "title", getter: "title" },
//   { key: "subtitle", getter: "subtitle" },
//   {
//     key: "button",
//     getter: [
//       { key: "cta", getter: "button.cta" },
//       { key: "link", getter: "button.link" },
//     ],
//   },
// ];
function getKeyGettersMap(translations: Translation, previousKey?: string) {
  const keys: TranslationGettter[] = [];
  for (const key in translations) {
    if (typeof translations[key as keyof Translation] === "object") {
      const subkeys = getKeyGettersMap(
        translations[key as keyof Translation],
        previousKey ? `${previousKey}.${key}` : key
      );
      keys.push({
        key,
        getter: subkeys.map((subkey) => {
          return {
            key: subkey.key,
            getter: subkey.getter,
          };
        }),
      });
    } else {
      keys.push({ key, getter: previousKey ? `${previousKey}.${key}` : key });
    }
  }
  return keys;
}

function resolveTranslation({
  t,
  translation,
}: {
  t: any;
  translation: TranslationGettter;
}): any {
  if (translation.getter instanceof Array) {
    return {
      [translation.key]: translation.getter.reduce((acc, subKey) => {
        return {
          ...acc,
          ...resolveTranslation({ t, translation: subKey }),
        };
      }, {}),
    };
  } else {
    return {
      [translation.key]: t(translation.getter),
    };
  }
}

export async function localize<T extends Translation>({
  namespace,
  TranslationClass,
}: {
  namespace: keyof FullTranslation;
  TranslationClass: new () => T;
}): Promise<T> {
  // get the namespace translations
  const t = await getTranslations(namespace);
  // create a "translation getters" array from the empty <T> value
  const translationsGetters = getKeyGettersMap(new TranslationClass());
  // maps translations values in a typescript file
  const translations = translationsGetters.reduce((acc, word) => {
    return {
      ...acc,
      ...resolveTranslation({ t, translation: word }),
    };
  }, {} as T) as T;
  // Returns:
  //   {
  //     title: "This is a server component",
  //     subtitle: "The javascript of this component is exectued server-side and not sent to the browser",
  //     button: {
  //       cta: "Click here to view this page in Italian",
  //       link: "/it"
  //     },
  //   };

  return translations;
}
