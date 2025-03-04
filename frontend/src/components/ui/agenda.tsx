import { Calendar, CalendarCurrentDate, CalendarDayView, CalendarEvent, CalendarMonthView, CalendarNextTrigger, CalendarPrevTrigger, CalendarTodayTrigger, CalendarViewSelector, CalendarViewTrigger, CalendarWeekView, CalendarYearView } from "@/components/ui/full-calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Locale } from 'date-fns';

export default function Agenda({ lng, events = [] }: { lng: Locale, events: CalendarEvent[] }) {
    const { t } = useTranslation();

    return (
        <Calendar locale={lng} events={events}>
            <div className="h-9/10 w-full py-6 flex flex-col">
                <div className="flex px-6 items-center gap-2 mb-6">
                    <div className="hidden sm:flex gap-2">
                        <CalendarViewTrigger className="aria-[current=true]:bg-accent" view="day">
                            {t('day')}
                        </CalendarViewTrigger>
                        <CalendarViewTrigger
                            view="week"
                            className="aria-[current=true]:bg-accent"
                        >
                            {t('week')}
                        </CalendarViewTrigger>
                        <CalendarViewTrigger
                            view="month"
                            className="aria-[current=true]:bg-accent"
                        >
                            {t('month')}
                        </CalendarViewTrigger>
                        <CalendarViewTrigger
                            view="year"
                            className="aria-[current=true]:bg-accent"
                        >
                            {t('year')}
                        </CalendarViewTrigger>
                    </div>
                    <div className="sm:hidden">
                        <CalendarViewSelector />
                    </div>

                    <span className="flex-1" />

                    <CalendarCurrentDate />

                    <CalendarPrevTrigger>
                        <ChevronLeft size={20} />
                        <span className="sr-only">{t('previous')}</span>
                    </CalendarPrevTrigger>

                    <CalendarTodayTrigger>{t('today')}</CalendarTodayTrigger>

                    <CalendarNextTrigger>
                        <ChevronRight size={20} />
                        <span className="sr-only">{t('next')}</span>
                    </CalendarNextTrigger>
                </div>

                <div className="flex-1 overflow-auto px-6 relative">
                    <CalendarDayView />
                    <CalendarWeekView />
                    <CalendarMonthView />
                    <CalendarYearView />
                </div>
            </div>
        </Calendar>
    )
}