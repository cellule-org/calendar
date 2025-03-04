import Agenda from "@/components/ui/agenda";
import { useTranslation } from "react-i18next";
import * as locales from 'date-fns/locale';
import { ModeToggle } from "@/components/ui/mode-toogle";

type LocaleKey = keyof typeof locales;

export default function index() {
  const { i18n } = useTranslation();
  const language = i18n.language;

  const getLocaleFromI18n = (language: string) => {
    if (locales[language as LocaleKey]) {
      return locales[language as LocaleKey];
    }

    const mainKey = language.split('-')[0];
    if (locales[mainKey as LocaleKey]) {
      return locales[mainKey as LocaleKey];
    }

    console.warn(`Locale not found for language: ${language}`);

    return locales['enUS'];
  }

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <section className="flex items-center justify-between w-full px-6 py-4">
        <h1 className="text-2xl font-bold text-primary">Calendar</h1>
        <ModeToggle />
      </section>
      <Agenda lng={getLocaleFromI18n(language)} events={[]} />
    </section>
  )
}

