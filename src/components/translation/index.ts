import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as resources from "./resources";

const getSavedLanguage = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("lng") || "al";
  }
  return "al";
};

i18n.use(initReactI18next).init({
  resources: {
    ...Object.entries(resources).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: {
          translation: value,
        },
      }),
      {}
    ),
  },
  lng: getSavedLanguage(),
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
