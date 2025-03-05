import React, { useEffect, useState } from 'react';

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CalendarEvent, useCalendar } from '@/components/ui/full-calendar';

import { format } from 'date-fns';

import { useTranslation } from 'react-i18next';
import { useWebSocketContext } from '@/lib/websocket-context';
import { DateTimePicker } from './date-time';

interface EditEventModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    event: CalendarEvent | null;
    children?: React.ReactNode;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({
    isOpen,
    onOpenChange,
    event,
    children,
}) => {
    const { sendMessage } = useWebSocketContext();

    const [title, setTitle] = useState(event ? event.title : '');
    const [description, setDescription] = useState(event ? event.description : '');
    const [start, setStart] = useState<Date>(event ? event.start : new Date());
    const [end, setEnd] = useState<Date>(event ? event.end : new Date(start.getTime() + 60 * 60 * 1000));

    useEffect(() => {
        if (event && (start.getHours() !== event.start.getHours() || start.getDate() !== event.start.getDate())) {
            setStart(event.start);
            setEnd(event.end);
        }

        if (event) {
            setTitle(event.title);
            setDescription(event.description);
            setStart(event.start);
            setEnd(event.end);
            setColor(event.color || 'default');
        }
    }, [event]);


    const possibleColors: ("default" | "red" | "orange" | "yellow" | "green" | "teal" | "cyan" | "blue" | "indigo" | "purple" | "pink")[] = ["default", "red", "orange", "yellow", "green", "teal", "cyan", "blue", "indigo", "purple", "pink"]
    const [color, setColor] = useState(event?.color || 'default');

    const { locale } = useCalendar();
    const { t } = useTranslation();

    const handleSave = () => {
        sendMessage({
            type: 'edit_event',
            data: {
                title,
                description,
                start,
                end,
                color,
            },
        });
    };

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
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger className={children ? '' : 'hidden'} asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('edit_event')}</DialogTitle>
                    <DialogDescription>
                        {format(start, 'PP', { locale })}
                    </DialogDescription>
                </DialogHeader>
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
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            onClick={handleSave}
                        >
                            {t('save')}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
