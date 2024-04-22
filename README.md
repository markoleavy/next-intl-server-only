# i18n for NextJS with App router and next-intl

## Guide to get a fully sever-side and strongly typed website translation system.

The purpose of this guide is to show how to implement i18n on NextJs, using App router and [next-intl](https://next-intl-docs.vercel.app), ensuring that the translation process takes place **entirely on server-side**, and introducing an additional stricter typing layer on translation sheets. It is ideal for both static (SSG) and dynamic (SSR) pages, but it's also useful for client-rendered pages.

## Why?

- **DX**: coding and mateinance is just easier and cleaner compared to the default json and `t()` function. With fully typed sheets and results, your translation will never miss a property and placing the right string in the right place wille be much easier!
- **Performance**: using server-side translations allow you to exclude the javascript needed to manage the process and the translation sheets from the client bundle, and avoid using additional context and processing in the browser.

## In brief

Natively, next-intl uses the function `t('word.to.translate')` - _obtatined with the hook `useTranslations('namespace')` and the `getTranslations('namespace')` async function_ - which returns the referenced translation as a string. This method is effective but it needs to be invoked once for each translated field, and becomes more and more complex as the number namespace nested objects grow.

This type of operation becomes even more complicated when you want **keep the translation process on server-side**. This means avoid using the hook `useTranslations()` on client components (and it's context provider `NextIntlClientProvider`) and pass translations to different nested components as props.

Server side usage with traditional `t()` function:


```ts
const Component: React.FC = () => {
  const t = useTranslations("Component");
  return (
    <div>
      <h2>{t("title")}</h2>
      <p>{t("subtitle")}</p>
      <Button link={t("button.link")} cta={t("button.cta")} />
      // Nesting nightmare begins..
      <NestedClientComponent
        title={t("nestedComponent.title")}
        subtitle={t("nestedComponent.subtitle")}
        // ...deeper and deeper..
        subNestedComponentProps={
          {
            text:t("nestedComponent.subNestetedComponent.text"),
            description:t("nestedComponent.subNestetedComponent.description"),
            // ...till the hell.
            nestedButton:{
              link: t("nestedComponent.subNestetedComponent.nestedButton.link"),
              cta: t("nestedComponent.subNestetedComponent.nestedButton.cta"),
            }
          }
        }
        buttonProps={{link:t("button.link")}, cta:{t("button.cta")}} />
    </div>
  );
};

//------//

// NestedClientComponent.tsx
'use-client'
const NestedClientComponent: React.FC = async ({
  title,
  subtitle,
  subNestedComponentProp,
}:
// NESTED COMPONENT PROPS NEED TO BE MANUALLY TYPED FOR EACH FORWARD STEP!!
{
  title: string;
  subtitle: string;
  subNestedComponentProps: {
    text: string;
    description: string;
    nestedButton: { link: string; cta: string };
  };
}) => {
  <div>
    <h2>{title}</h2>
    <h3>{subtitle}</h3>
    <SubNestedComponent
      translations= {subNestedComponentProps}
    />
  </div>;
};



```

With the method I propose you can obtain the translations of each namespace as a **structured typescript object** with a single invocation, whose properties and sub-properties can be passed to child components and that share its type with the namaspace that is source of the transaltion (contained in the `lang.json` file).

```ts
// Serve-side usage with custom localize() function.
// import the namspace class/type
import { ComponentT } from "../translations/classes/ComponentT";

const Component: React.FC = async () => {
  // the function is invoked just ones.
  const translations = await localize({
    namespace: "Component",
    translationClass: ComponentT,
  });
  return (
    <div>
      <h2>{translations.title}</h2>
      <p>{translations.subtitle}</p>
      <Button translations={translations.button} />
      // translations.nestedComponent already contains all the props
      <NestedClientComponent translations={transaltions.nestedComponent} />
    </div>
  );
};

//------//

// NestedClientComponent.tsx
("use-client");
import { ComponentT } from "../translations/classes/ComponentT";
const NestedClientComponent: React.FC = async (
  // translations can be type easily as ComponentT["nestedComponent"]
  { translations }: { translations: ComponentT["nestedComponent"] }
) => {
  <div>
    <h2>{title}</h2>
    <h3>{subtitle}</h3>
    <SubNestedComponent translations={translations.subNestetedComponent} />
  </div>;
};
```

#### Note:

_This strategy involoves using what is known as prop-drilling. There are extensive discussions on the web about whether you should or should not use prop-drilling. I won't get into this topic, but if you want to avoid using the intl context on client components, it's the only way to do it. Certainly, one of the most negative aspects of prop drilling is the need to manually type the objects that are gradually passed towards the end of the tree. Following this method, this process is greatly simplified._

## Step by step

### Step 1: Create a new Next project with next-intl.

If you aren't already working on a Next project with App router, or haven't implemented next-intl yet, I recommend using the [official guide](https://next-intl-docs.vercel.app/docs/getting-started/app-router), which is very comprehensive and detailed for all steps and functions available.
For this tutorial, we will use [this single-page project](https://github.com/markoleavy/next-intl-traditional) as a starting point, which uses both server and client component functions.
It also use the `unstable_setRequestLocale` function to optimize performance as much as possible statically rendering pages (again, check the [next-intl official documentation](https://next-intl-docs.vercel.app/docs/getting-started/app-router) for details).

### Step 2: JSON to Typescript sheets.

Once you have implemented a basic setup or downloaded the demo, the first thing to do is to transform the `.json` translation files into `.ts` files.
If you use prettier, renaming the files and wrapping the content in a constant, exporting it as deafult and auto-formatting should be sufficient.

Before:

```json
// en.json
{
  "Index": {
    "title": "This is a demo page for next-intl"
  },
  "ServerComponent": {
    "title": "This is a server component",
    "subtitle": "The javascript of this component is exectued server-side and not sent to the browser",
    "button": {
      "cta": "Click here to view this page in Italian",
      "link": "/it"
    }
  },
  "ClientComponent": {
    "title": "This is a client component",
    "subtitle": "The javascript of this component is sent and executed in the browser",
    "button": {
      "cta": "Click here to view this page in Italian",
      "link": "/it"
    }
  }
}
```

After:

```ts
// en.ts
const en = {
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
```

Then change the extension inside the `i18n.ts` file from `.json` to `.ts`.

```ts
// i18n.ts
import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "it"];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    // This extention needs to be modified from .json to .ts
    messages: (await import(`../translations/${locale}.ts`)).default,
  };
});
```

### Step 3: Types and Classes.

Now create a "types" folder inside the 'translations' folder (or wherever you want) and create a 'Translations.ts' file that will contain an empty interface.

```ts
// Translations.ts
export interface Translation {}
```

Then create a file for each of your "namespace" (in this case Index, ClientComponentProps, and ServerComponentProps), containing the declaration of the **class** representing it, using empty strings for the fields:

```ts
// ServerComponentT.ts
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
```

Create a file to define the type of the translation table, gathering all the namespaces and corresponding classes.

```ts
// FullTranslation.ts
import { ClientComponentT } from "./ClientComponentT";
import { IndexT } from "./IndexT";
import { ServerComponentT } from "./ServerComponentT";

export type FullTranslation = {
  Index: IndexT;
  ServerComponentProps: ServerComponentT;
  ClientComponentProps: ClientComponentT;
};
```

Assing the `FullTranslation` type to each translation sheet. Any missing or unrequired field will be now reported by code editor.

```ts
// en.ts
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
```

### Step 4: the `localize()` function.

And now the heavy lifting: create a "localize.ts", that exports the `localize()` function. This function takes a namespace string value and a Translation class as parameters, and returns a typescript object, containing all the namespace translations.

```ts
import { getTranslations } from "next-intl/server";
import type { Translation } from "../translations/types/Translation";
import { FullTranslation } from "../translations/types/FullTranslation";
type TranslationGettter = {
  key: string;
  getter: string | TranslationGettter[];
};
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

  return translations;
}
```

#### How it works?

_The function creates an instance of the `TranlsatonClass`, and recursively iterates over its empty fields - with `getKeyGettersMap()`- to create an array of `TranslationGettter` objects._

When invoked for `ServeComponentT`, `getKeyGettersMap()` will return:

```ts
[
  { key: "title", getter: "title" },
  { key: "subtitle", getter: "subtitle" },
  {
    key: "button",
    getter: [
      { key: "cta", getter: "button.cta" },
      { key: "link", getter: "button.link" },
    ],
  },
];
```

_It then recursively iterates over this array with the function `resovleTranslation()` returning the namespace as a structured obejct._

```ts
{
  title: "This is a server component",
  subtitle: "The javascript of this component is exectued server-side and not sent to the browser",
  button: {
    cta: "Click here to view this page in Italian",
    link: "/it"
  },
};
```

### Step 5: convert server and client components.

You can now convert the ServerComponent like this.

Before:

```ts
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import React from "react";
import Button from "./Button";

const ServerComponent: React.FC = async () => {
  const t = await getTranslations("ServerComponent");
  // alternative you can use:
  // const t = useTranslations("ServerComponent");
  return (
    <div>
      <h2>{t("title")}</h2>
      <p>{t("subtitle")}</p>
      <Button link={t("button.link")} cta={t("button.cta")} />
    </div>
  );
};

export default ServerComponent;
```

After:

```ts
import Button from "./Button";
import { localize } from "./localize";
import { ServerComponentT } from "../translations/types/ServerComponentT";

const ServerComponent: React.FC = async () => {
  const translations = await localize({
    namespace: "ServerComponentProps",
    TranslationClass: ServerComponentT,
  });
  return (
    <div>
      <h2>{translations.title}</h2>
      <p>{translations.subtitle}</p>
      <Button translations={translations.button} />
    </div>
  );
};

export default ServerComponent;
```

Now convert the ClientComponent, removing the useTranslation hook and adding the translation prop, using the class as a type.
Before:

```ts
import { useTranslations } from "next-intl";
import React from "react";
import Button from "./Button";

const ClientComponent: React.FC = () => {
  const t = useTranslations("ClientComponent");
  return (
    <div>
      <h2>{t("title")}</h2>
      <p>{t("subtitle")}</p>
      <Button link={t("button.link")} cta={t("button.cta")} />
    </div>
  );
};

export default ClientComponent;
```

After:

```ts
"use client";
import Button from "./Button";
import { ClientComponentT } from "../translations/types/ClientComponentT";

const ClientComponent: React.FC<{ translations: ClientComponentT }> = ({
  translations,
}) => {
  return (
    <div>
      <h2>{translations.title}</h2>
      <p>{translations.subtitle}</p>
      <Button translations={translations.button} />
    </div>
  );
};

export default ClientComponent;
```

Use the same method for generic components like Button (used both as client components and server components), always leveraging the subtypes of the Translation class, or creating a dedicate class and namespace.

```ts
import Link from "next/link";
import React, { useEffect } from "react";
import { ClientComponentT } from "../translations/types/ClientComponentT";

const Button: React.FC<{ translations: ClientComponentT["button"] }> = ({
  translations: { link, cta },
}) => {
  return (
    <Link href={link}>
      <button>{cta}</button>
    </Link>
  );
};

export default Button;
s;
```

### Step 6: remove the context provider.

Now you can remove the "NextIntlClientProvider" from the layout and the "message" constant, as you are not using `useTranslation()` hook on client components anymore.
Before:

```ts
import { locales } from "@/i18n";
import { unstable_setRequestLocale } from "next-intl/server";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  // const messages = useMessages();
  return (
    <html lang={locale}>
      <body>
        {/*<NextIntlClientProvider messages={messages}>*/}
        {children}
        {/*</NextIntlClientProvider>*/}
      </body>
    </html>
  );
}
```

After:

```ts
import { locales } from "@/i18n";
import { unstable_setRequestLocale } from "next-intl/server";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return (
    <html lang={locale}>
      {/* We dont' need next-intl context wrapper*/}
      <body>{children}</body>
    </html>
  );
}
```

## Thats it!

As promised, translation is now exectued fully on server-side, translation sheets are strongly typed and components props are easy to mangage! Here you can find the [final result](https://github.com/markoleavy/next-intl-server-only).
