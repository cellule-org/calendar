import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DateTimePicker } from './date-time';
import { useCalendar } from '@/components/ui/full-calendar';
import { useTranslation } from 'react-i18next';

interface EventFormProps {
    title: string;
    setTitle: (title: string) => void;
    description: string;
    setDescription: (description: string) => void;
    start: Date;
    setStart: (date: Date) => void;
    end: Date;
    setEnd: (date: Date) => void;
    color: string;
    setColor: React.Dispatch<React.SetStateAction<"default" | "blue" | "green" | "pink" | "purple" | "red" | "yellow" | "teal" | "cyan" | "orange" | "indigo">>
}

export const EventForm: React.FC<EventFormProps> = ({
    title,
    setTitle,
    description,
    setDescription,
    start,
    setStart,
    end,
    setEnd,
    color,
    setColor,
}) => {
    const possibleColors: ("default" | "blue" | "green" | "pink" | "purple" | "red" | "yellow" | "teal" | "cyan" | "orange" | "indigo")[] = ["default", "red", "orange", "yellow", "green", "teal", "cyan", "blue", "indigo", "purple", "pink"];
    const { locale } = useCalendar();
    const { t } = useTranslation();

    const getBorderColorClass = (currentColor: string, selectedColor: string) => {
        if (currentColor !== selectedColor) return 'border-gray-300';

        switch (selectedColor) {
            case 'default': return 'border-gray-700';
            case 'red': return 'border-red-700';
            case 'orange': return 'border-orange-700';
            case 'yellow': return 'border-yellow-700';
            case 'green': return 'border-green-700';
            case 'teal': return 'border-teal-700';
            case 'cyan': return 'border-cyan-700';
            case 'blue': return 'border-blue-700';
            case 'indigo': return 'border-indigo-700';
            case 'purple': return 'border-purple-700';
            case 'pink': return 'border-pink-700';
            default: return 'border-gray-300';
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <Label htmlFor="title" >
                    {t('title')}
                </Label>
                <Input id='title' value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="description" >
                    {t('description')}
                </Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="start" >
                    {t('start')}
                </Label>
                <DateTimePicker locale={locale} date={start} setDate={setStart} />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="end" >
                    {t('end')}
                </Label>
                <DateTimePicker locale={locale} date={end} setDate={setEnd} />
            </div>
            <div className="flex flex-col gap-2">
                <Label>
                    {t('color')}
                </Label>
                <div className="flex gap-2">
                    {possibleColors.map((c) => (
                        <button
                            key={c}
                            onClick={() => setColor(c)}
                            className={`rounded-full h-6 w-6 bg-${c}-500 border-2 focus:outline-none ${getBorderColorClass(color, c)}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
