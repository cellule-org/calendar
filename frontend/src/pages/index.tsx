import Agenda from "@/components/ui/agenda";
import { useTranslation } from "react-i18next";
import * as locales from 'date-fns/locale';
import { ModeToggle } from "@/components/ui/mode-toogle";
import { useEffect, useState } from "react";

type LocaleKey = keyof typeof locales;

export default function index() {
  const { i18n } = useTranslation();
  const language = i18n.language;
  const [events, setEvents] = useState<any[]>([]);

  const getLocaleFromI18n = (language: string) => {
    if (locales[language as LocaleKey]) {
      return locales[language as LocaleKey];
    }

    const secondaryLanguage = language.split('-').join('');
    if (locales[secondaryLanguage as LocaleKey]) {
      return locales[secondaryLanguage as LocaleKey];
    }

    const mainKey = language.split('-')[0];
    if (locales[mainKey as LocaleKey]) {
      return locales[mainKey as LocaleKey];
    }

    console.warn(`Locale not found for language: ${language}`);

    return locales['enUS'];
  }

  useEffect(() => {
    const handleLoadEvents = (event: Event) => {
      const customEvent = event as CustomEvent;
      const eventData = customEvent.detail.map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(eventData);
    };

    const handleAddEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      const eventData = customEvent.detail;
      setEvents(prevEvents => [...prevEvents, {
        ...eventData,
        start: new Date(eventData.start),
        end: new Date(eventData.end),
      }]);
    }

    const handleRemoveEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      const eventId = customEvent.detail;
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    }

    window.addEventListener('loadEvents', handleLoadEvents);
    window.addEventListener('eventAdded', handleAddEvent);
    window.addEventListener('eventRemoved', handleRemoveEvent);

    return () => {
      window.removeEventListener('loadEvents', handleLoadEvents);
      window.removeEventListener('eventAdded', handleAddEvent);
      window.removeEventListener('eventRemoved', handleRemoveEvent);
    };
  }, []);

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <section className="flex items-center justify-between w-full px-6 py-4">
        <h1 className="text-2xl font-bold text-primary">Calendar</h1>
        <ModeToggle />
      </section>
      <Agenda lng={getLocaleFromI18n(language)} events={events} />
    </section>
  )
}

