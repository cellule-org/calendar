import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import {
    Locale,
    addDays,
    addMonths,
    addWeeks,
    addYears,
    differenceInMinutes,
    format,
    getMonth,
    isSameDay,
    isSameHour,
    isSameMonth,
    isToday,
    setHours,
    setMonth,
    startOfMonth,
    startOfWeek,
    subDays,
    subMonths,
    subWeeks,
    subYears,
} from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import {
    ReactNode,
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useMemo,
    useState,
    useEffect,
} from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

import { useTranslation } from 'react-i18next';
import { AddEventModal } from './add-event';
import { RemoveEventModal } from './remove-event';
import { EditEventModal } from './edit-event';

const monthEventVariants = cva('size-2 rounded-full', {
    variants: {
        variant: {
            default: 'bg-primary',
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            pink: 'bg-pink-500',
            purple: 'bg-purple-500',
            red: 'bg-red-500',
            yellow: 'bg-yellow-500',
            teal: 'bg-teal-500',
            cyan: 'bg-cyan-500',
            orange: 'bg-orange-500',
            indigo: 'bg-indigo-500',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

const dayEventVariants = cva('font-bold border-l-4 rounded p-2 text-xs', {
    variants: {
        variant: {
            default: 'bg-muted/45 text-muted-foreground border-muted',
            blue: 'bg-blue-500/45 text-blue-600 border-blue-500',
            green: 'bg-green-500/45 text-green-600 border-green-500',
            pink: 'bg-pink-500/45 text-pink-600 border-pink-500',
            purple: 'bg-purple-500/45 text-purple-600 border-purple-500',
            red: 'bg-red-500/45 text-red-600 border-red-500',
            yellow: 'bg-yellow-500/45 text-yellow-600 border-yellow-500',
            teal: 'bg-teal-500/45 text-teal-600 border-teal-500',
            cyan: 'bg-cyan-500/45 text-cyan-600 border-cyan-500',
            orange: 'bg-orange-500/45 text-orange-600 border-orange-500',
            indigo: 'bg-indigo-500/45 text-indigo-600 border-indigo-500',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

type View = 'day' | 'week' | 'month' | 'year';

type ContextType = {
    view: View;
    setView: (view: View) => void;
    date: Date;
    setDate: (date: Date) => void;
    events: CalendarEvent[];
    locale: Locale;
    setEvents: (date: CalendarEvent[]) => void;
    onChangeView?: (view: View) => void;
    onEventClick?: (event: CalendarEvent) => void;
    enableHotkeys?: boolean;
    today: Date;
};

const Context = createContext<ContextType>({} as ContextType);

export type CalendarEvent = {
    id: string;
    start: Date;
    end: Date;
    title: string;
    description: string;
    color?: VariantProps<typeof monthEventVariants>['variant'];
};

type CalendarProps = {
    children: ReactNode;
    defaultDate?: Date;
    events?: CalendarEvent[];
    view?: View;
    locale?: Locale;
    enableHotkeys?: boolean;
    onChangeView?: (view: View) => void;
    onEventClick?: (event: CalendarEvent) => void;
};

const Calendar = ({
    children,
    defaultDate = new Date(),
    locale = enUS,
    enableHotkeys = true,
    view: _defaultMode = 'month',
    onEventClick,
    events: defaultEvents = [],
    onChangeView,
}: CalendarProps) => {
    const [view, setView] = useState<View>(_defaultMode);
    const [date, setDate] = useState(defaultDate);
    const [events, setEvents] = useState<CalendarEvent[]>(defaultEvents);

    useEffect(() => {
        setEvents(defaultEvents);
    }, [defaultEvents]);

    const changeView = (view: View) => {
        setView(view);
        onChangeView?.(view);
    };

    useHotkeys('m', () => changeView('month'), {
        enabled: enableHotkeys,
    });

    useHotkeys('w', () => changeView('week'), {
        enabled: enableHotkeys,
    });

    useHotkeys('y', () => changeView('year'), {
        enabled: enableHotkeys,
    });

    useHotkeys('d', () => changeView('day'), {
        enabled: enableHotkeys,
    });

    return (
        <Context.Provider
            value={{
                view,
                setView,
                date,
                setDate,
                events,
                setEvents,
                locale,
                enableHotkeys,
                onEventClick,
                onChangeView,
                today: new Date(),
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useCalendar = () => useContext(Context);

const CalendarViewTrigger = forwardRef<
    HTMLButtonElement,
    React.HTMLAttributes<HTMLButtonElement> & {
        view: View;
    }
>(({ children, view, ...props }) => {
    const { view: currentView, setView, onChangeView } = useCalendar();

    return (
        <Button
            aria-current={currentView === view}
            size="sm"
            variant="ghost"
            {...props}
            onClick={() => {
                setView(view);
                onChangeView?.(view);
            }}
        >
            {children}
        </Button>
    );
});
CalendarViewTrigger.displayName = 'CalendarViewTrigger';

const CalendarViewSelector = () => {
    const { view, setView, onChangeView } = useCalendar();
    const { t } = useTranslation();


    return (
        <Select onValueChange={(value) => {
            setView(value as View);
            onChangeView?.(value as View);
        }} defaultValue={view}>
            <SelectTrigger>
                <SelectValue>{t(view)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="day">{t('day')}</SelectItem>
                    <SelectItem value="week">{t('week')}</SelectItem>
                    <SelectItem value="month">{t('month')}</SelectItem>
                    <SelectItem value="year">{t('year')}</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
CalendarViewSelector.displayName = 'CalendarViewSelector';

const clearMinutes = (date: Date) => {
    const newDate = new Date(date);
    newDate.setMinutes(0);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    console.log(newDate);
    return newDate;
}
const EventGroup = ({
    events,
    hour,
}: {
    events: CalendarEvent[];
    hour: Date;
}) => {
    const [createOpen, setCreateOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const [editOpen, setEditOpen] = useState(false);

    const [removeOpen, setRemoveOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    const { locale } = useCalendar();
    const { t } = useTranslation();

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger>
                    <div
                        className="h-20 border-t last:border-b relative"
                        onDoubleClick={() => {
                            setSelectedDate(hour);
                            setCreateOpen(true);
                        }}
                    >
                        {events
                            .filter((event) => isSameHour(event.start, hour))
                            .map((event) => {
                                const hoursDifference =
                                    differenceInMinutes(event.end, event.start) / 60;
                                const startPosition = event.start.getMinutes() / 60;

                                return (
                                    <ContextMenu key={event.id}>
                                        <ContextMenuTrigger asChild>
                                            <div
                                                className={cn(
                                                    'relative z-10',
                                                    dayEventVariants({ variant: event.color })
                                                )}
                                                style={{
                                                    top: `${startPosition * 100}%`,
                                                    height: `${Math.min(hoursDifference, 24 - event.start.getHours() - startPosition) * 102}%`,
                                                }}
                                                onContextMenu={(e) => e.stopPropagation()} // Prevent context menu on event
                                                onDoubleClick={(e) => {
                                                    e.stopPropagation(); // Prevent triggering the parent double click
                                                    setSelectedEvent(event);
                                                    setEditOpen(true);
                                                }}
                                            >
                                                <section className="flex items-center gap-2">
                                                    {event.title}
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(event.start, 'HH:mm')} -{' '}
                                                        {format(event.end, 'HH:mm')}
                                                    </p>
                                                </section>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {event.description}
                                                </p>
                                            </div>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                            <ContextMenuLabel>{format(clearMinutes(hour), 'EEEE, dd/MM HH:00', { locale })}</ContextMenuLabel>
                                            <ContextMenuSeparator />
                                            <ContextMenuItem
                                                onClick={() => {
                                                    setSelectedDate(clearMinutes(hour));
                                                    setCreateOpen(true);
                                                }}
                                            >
                                                {t('add_event')}
                                            </ContextMenuItem>
                                            <ContextMenuItem
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    setEditOpen(true);
                                                }}
                                            >
                                                {t('edit_event')}
                                            </ContextMenuItem>
                                            <ContextMenuItem
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    setRemoveOpen(true);
                                                }}
                                            >
                                                {t('remove_event')}
                                            </ContextMenuItem>
                                        </ContextMenuContent>
                                    </ContextMenu>
                                );
                            })}
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuLabel>{format(hour, 'EEEE, dd/MM HH:mm', { locale })}</ContextMenuLabel>
                    <ContextMenuSeparator />
                    <ContextMenuItem
                        onClick={() => {
                            setCreateOpen(true);
                            setSelectedDate(hour);
                        }}
                    >
                        {t('add_event')}
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
            <AddEventModal isOpen={createOpen} onOpenChange={setCreateOpen} start={selectedDate || undefined} />
            <EditEventModal isOpen={editOpen} onOpenChange={setEditOpen} event={selectedEvent} />
            <RemoveEventModal isOpen={removeOpen} onOpenChange={setRemoveOpen} event={selectedEvent} />
        </>
    );
};

const CalendarDayView = () => {
    const { view, events, date } = useCalendar();

    if (view !== 'day') return null;

    const hours = [...Array(24)].map((_, i) => setHours(date, i));

    return (
        <div className="flex relative pt-2 overflow-x-hidden overflow-y-auto h-full">
            <TimeTable />
            <div className="flex-1">
                {hours.map((hour) => (
                    <EventGroup key={hour.toString()} hour={hour} events={events} />
                ))}
            </div>
        </div>
    );
};

const CalendarWeekView = () => {
    const { view, date, locale, events } = useCalendar();

    const weekDates = useMemo(() => {
        const start = startOfWeek(date, { weekStartsOn: 0 });
        const weekDates = [];

        for (let i = 0; i < 7; i++) {
            const day = addDays(start, i);
            const hours = [...Array(24)].map((_, i) => setHours(day, i));
            weekDates.push(hours);
        }

        return weekDates;
    }, [date]);

    const headerDays = useMemo(() => {
        const daysOfWeek = [];
        for (let i = 0; i < 7; i++) {
            const result = addDays(startOfWeek(date, { weekStartsOn: 0 }), i);
            daysOfWeek.push(result);
        }
        return daysOfWeek;
    }, [date]);

    if (view !== 'week') return null;

    return (
        <div className="flex flex-col relative overflow-hidden overflow-y-auto h-full">
            <div className="flex sticky top-0 bg-card z-10 border-b mb-3">
                <div className="w-12"></div>
                {headerDays.map((date, i) => (
                    <div
                        key={date.toString()}
                        className={cn(
                            'text-center flex-1 gap-1 pb-2 text-sm text-muted-foreground flex items-center justify-center',
                            [0, 6].includes(i) && 'text-muted-foreground/50'
                        )}
                    >
                        {format(date, 'E', { locale })}
                        <span
                            className={cn(
                                'h-6 grid place-content-center',
                                isToday(date) &&
                                'bg-primary text-primary-foreground rounded-full size-6'
                            )}
                        >
                            {format(date, 'd')}
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex flex-1">
                <div className="w-fit">
                    <TimeTable />
                </div>
                <div className="grid grid-cols-7 flex-1">
                    {weekDates.map((hours, i) => {
                        return (
                            <div
                                className={cn(
                                    'h-full text-sm text-muted-foreground border-l first:border-l-0',
                                    [0, 6].includes(i) && 'bg-muted/50'
                                )}
                                key={hours[0].toString()}
                            >
                                {hours.map((hour) => (
                                    <EventGroup
                                        key={hour.toString()}
                                        hour={hour}
                                        events={events}
                                    />
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const CalendarMonthView = () => {
    const [createOpen, setCreateOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const { date, view, events, locale, setView, setDate } = useCalendar();

    const { t } = useTranslation();

    const monthDates = useMemo(() => getDaysInMonth(date), [date]);
    const weekDays = useMemo(() => generateWeekdays(locale), [locale]);

    if (view !== 'month') return null;

    return (
        <>
            <div className="h-full flex flex-col">
                <div className="grid grid-cols-7 gap-px sticky top-0 bg-background border-b">
                    {weekDays.map((day, i) => (
                        <div
                            key={day}
                            className={cn(
                                'mb-2 text-right text-sm text-muted-foreground pr-2',
                                [0, 6].includes(i) && 'text-muted-foreground/50'
                            )}
                        >
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid overflow-hidden -mt-px flex-1 auto-rows-fr p-px grid-cols-7 gap-px">
                    {monthDates.map((_date) => {
                        const currentEvents = events.filter((event) =>
                            isSameDay(event.start, _date)
                        );

                        return (
                            <ContextMenu>
                                <ContextMenuTrigger>
                                    <div
                                        className={cn(
                                            'ring-1 p-2 text-sm text-muted-foreground ring-border overflow-auto h-full',
                                            !isSameMonth(date, _date) && 'text-muted-foreground/50'
                                        )}
                                        key={_date.toString()}
                                    >
                                        <span
                                            className={cn(
                                                'size-6 grid place-items-center rounded-full mb-1 sticky top-0 cursor-pointer',
                                                isToday(_date) && 'bg-primary text-primary-foreground'
                                            )}

                                            onClick={() => {
                                                setView('day');
                                                setDate(_date);
                                            }}
                                        >
                                            {format(_date, 'd')}
                                        </span>

                                        {currentEvents.map((event) => {
                                            return (
                                                <div
                                                    key={event.id}
                                                    className="px-1 rounded text-sm flex items-center gap-1"
                                                >
                                                    <div
                                                        className={cn(
                                                            'shrink-0',
                                                            monthEventVariants({ variant: event.color })
                                                        )}
                                                    ></div>
                                                    <span className="flex-1 truncate">{event.title}</span>
                                                    <time className="tabular-nums text-muted-foreground/50 text-xs">
                                                        {format(event.start, 'HH:mm')}
                                                    </time>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </ContextMenuTrigger>
                                <ContextMenuContent>
                                    <ContextMenuLabel>{format(_date, 'EEEE, dd/MM', { locale })}</ContextMenuLabel>
                                    <ContextMenuSeparator />
                                    <ContextMenuItem onClick={() => {
                                        setSelectedDate(setHours(new Date(_date), 12));
                                        setCreateOpen(true);
                                    }}>
                                        {t('add_event')}
                                    </ContextMenuItem>
                                </ContextMenuContent>
                            </ContextMenu>
                        );
                    })}
                </div>
            </div>
            <AddEventModal isOpen={createOpen} onOpenChange={setCreateOpen} start={selectedDate || undefined} />
        </>
    );
};

const CalendarYearView = () => {
    const [createOpen, setCreateOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const { view, date, today, locale, setView, setDate, events } = useCalendar();
    const { t } = useTranslation();

    const months = useMemo(() => {
        if (!view) {
            return [];
        }

        return Array.from({ length: 12 }).map((_, i) => {
            return getDaysInMonth(setMonth(date, i));
        });
    }, [date, view]);

    const weekDays = useMemo(() => generateWeekdays(locale), [locale]);

    if (view !== 'year') return null;

    return (
        <>
            <div className="grid grid-cols-4 gap-10 overflow-auto h-full">
                {months.map((days, i) => (
                    <div key={days[0].toString()}>
                        <span className="text-xl">{i + 1}</span>

                        <div className="grid grid-cols-7 gap-2 my-5">
                            {weekDays.map((day) => (
                                <div
                                    key={day}
                                    className="text-center text-xs text-muted-foreground"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid gap-x-2 text-center grid-cols-7 text-xs tabular-nums">
                            {days.map((_date) => {
                                const currentEvents = events.filter((event) =>
                                    isSameDay(event.start, _date)
                                ).slice(0, 3);

                                return (
                                    <ContextMenu>
                                        <ContextMenuTrigger>
                                            <div
                                                key={_date.toString()}
                                                className={cn(
                                                    'relative',
                                                    getMonth(_date) !== i && 'text-muted-foreground'
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        'aspect-square grid place-content-center size-full tabular-nums cursor-pointer',
                                                        isSameDay(today, _date) &&
                                                        getMonth(_date) === i &&
                                                        'bg-primary text-primary-foreground rounded-full'
                                                    )}

                                                    onClick={() => {
                                                        setView('day');
                                                        setDate(_date);
                                                    }}
                                                >
                                                    {format(_date, 'd')}
                                                </div>
                                                <div className="flex justify-center mb-2 space-x-1 w-full bottom-0 absolute">
                                                    {currentEvents.map((event) => (
                                                        <div
                                                            key={event.id}
                                                            className={cn(
                                                                '!size-1 rounded-full',
                                                                monthEventVariants({ variant: event.color })
                                                            )}
                                                        ></div>
                                                    ))}
                                                </div>
                                            </div>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                            <ContextMenuLabel>
                                                {format(_date, 'EEEE, dd/MM', { locale })}
                                            </ContextMenuLabel>
                                            <ContextMenuSeparator />
                                            <ContextMenuItem onClick={() => {
                                                setSelectedDate(_date);
                                                setCreateOpen(true);
                                            }}></ContextMenuItem>
                                            {t('add_event')}
                                        </ContextMenuContent>
                                    </ContextMenu>
                                );
                            })}

                        </div>
                    </div>
                ))}
            </div >

            <AddEventModal isOpen={createOpen} onOpenChange={setCreateOpen} start={selectedDate || undefined} />
        </>
    );
};

const CalendarNextTrigger = forwardRef<
    HTMLButtonElement,
    React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
    const { date, setDate, view, enableHotkeys } = useCalendar();

    const next = useCallback(() => {
        if (view === 'day') {
            setDate(addDays(date, 1));
        } else if (view === 'week') {
            setDate(addWeeks(date, 1));
        } else if (view === 'month') {
            setDate(addMonths(date, 1));
        } else if (view === 'year') {
            setDate(addYears(date, 1));
        }
    }, [date, view, setDate]);

    useHotkeys('ArrowRight', () => next(), {
        enabled: enableHotkeys,
    });

    return (
        <Button
            size="icon"
            variant="outline"
            ref={ref}
            {...props}
            onClick={(e) => {
                next();
                onClick?.(e);
            }}
        >
            {children}
        </Button>
    );
});
CalendarNextTrigger.displayName = 'CalendarNextTrigger';

const CalendarPrevTrigger = forwardRef<
    HTMLButtonElement,
    React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
    const { date, setDate, view, enableHotkeys } = useCalendar();

    useHotkeys('ArrowLeft', () => prev(), {
        enabled: enableHotkeys,
    });

    const prev = useCallback(() => {
        if (view === 'day') {
            setDate(subDays(date, 1));
        } else if (view === 'week') {
            setDate(subWeeks(date, 1));
        } else if (view === 'month') {
            setDate(subMonths(date, 1));
        } else if (view === 'year') {
            setDate(subYears(date, 1));
        }
    }, [date, view, setDate]);

    return (
        <Button
            size="icon"
            variant="outline"
            ref={ref}
            {...props}
            onClick={(e) => {
                prev();
                onClick?.(e);
            }}
        >
            {children}
        </Button>
    );
});
CalendarPrevTrigger.displayName = 'CalendarPrevTrigger';

const CalendarTodayTrigger = forwardRef<
    HTMLButtonElement,
    React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
    const { setDate, enableHotkeys, today } = useCalendar();

    useHotkeys('t', () => jumpToToday(), {
        enabled: enableHotkeys,
    });

    const jumpToToday = useCallback(() => {
        setDate(today);
    }, [today, setDate]);

    return (
        <Button
            variant="outline"
            ref={ref}
            {...props}
            onClick={(e) => {
                jumpToToday();
                onClick?.(e);
            }}
        >
            {children}
        </Button>
    );
});
CalendarTodayTrigger.displayName = 'CalendarTodayTrigger';

const CalendarCurrentDate = () => {
    const { date, view, locale } = useCalendar();

    return (
        <time dateTime={date.toISOString()} className="tabular-nums">
            {format(date, view === 'year' ? 'yyyy' : view === 'day' ? 'EEEE, dd MMMM yyyy' : 'MMMM yyyy', { locale })}
        </time>
    );
};

const TimeTable = () => {
    const now = new Date();

    return (
        <div className="pr-2 w-12">
            {Array.from(Array(25).keys()).map((hour) => {
                return (
                    <div
                        className="text-right relative text-xs text-muted-foreground/50 h-20 last:h-0"
                        key={hour}
                    >
                        {now.getHours() === hour && (
                            <div
                                className="absolute z- left-full translate-x-2 w-dvw h-[2px] bg-red-500 pointer-events-none"
                                style={{
                                    top: `${(now.getMinutes() / 60) * 100}%`,
                                }}
                            >
                                <div className="size-2 rounded-full bg-red-500 absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                            </div>
                        )}
                        <p className="top-0 -translate-y-1/2">
                            {hour === 24 ? 0 : hour}:00
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

const getDaysInMonth = (date: Date) => {
    const startOfMonthDate = startOfMonth(date);
    const startOfWeekForMonth = startOfWeek(startOfMonthDate, {
        weekStartsOn: 0,
    });

    let currentDate = startOfWeekForMonth;
    const calendar = [];

    while (calendar.length < 42) {
        calendar.push(new Date(currentDate));
        currentDate = addDays(currentDate, 1);
    }

    return calendar;
};

const generateWeekdays = (locale: Locale) => {
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
        const date = addDays(startOfWeek(new Date(), { weekStartsOn: 0 }), i);
        daysOfWeek.push(format(date, 'EEEEEE', { locale }));
    }
    return daysOfWeek;
};

export {
    Calendar,
    CalendarCurrentDate,
    CalendarDayView,
    CalendarMonthView,
    CalendarNextTrigger,
    CalendarPrevTrigger,
    CalendarTodayTrigger,
    CalendarViewTrigger,
    CalendarViewSelector,
    CalendarWeekView,
    CalendarYearView,
};