import { getTranslations } from "next-intl/server";
import { Translation } from "../translations/types/Translation";
type TranslationGettter = {
  key: string;
  getter: string | TranslationGettter[];
};

function getKeyGettersMap<T extends Translation>(
  translations: T,
  previousKey?: string
) {
  const keys: TranslationGettter[] = [];
  for (const key in translations) {
    if (key === "namespace") {
      continue;
    } else if (typeof translations[key] === "object") {
      const subkeys = getKeyGettersMap(
        translations[key] as Translation,
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

export async function localize<T extends Translation>(
  TranslationClass: new () => T
): Promise<T> {
  // get the namespace translations
  const translationClassInstance = new TranslationClass();
  const t = await getTranslations(translationClassInstance.namespace);
  // create a "translation getters" array from the empty <T> value
  const translationsGetters = getKeyGettersMap(translationClassInstance);
  // maps translations values in a typescript file
  const translations = translationsGetters.reduce((acc, word) => {
    return {
      ...acc,
      ...resolveTranslation({ t, translation: word }),
    };
  }, {} as T) as T;

  return translations;
}
