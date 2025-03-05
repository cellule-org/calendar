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
import { useCalendar } from '@/components/ui/full-calendar';

import { format } from 'date-fns';

import { useTranslation } from 'react-i18next';
import { useWebSocketContext } from '@/lib/websocket-context';
import { DateTimePicker } from './date-time';

interface AddEventModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    start?: Date;
    end?: Date;
    children?: React.ReactNode;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
    isOpen,
    onOpenChange,
    start: _start = new Date(),
    end: _end,
    children,
}) => {
    const { sendMessage } = useWebSocketContext();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [start, setStart] = useState<Date>(_start);
    const [end, setEnd] = useState<Date>(_end || new Date(_start.getTime() + 60 * 60 * 1000));

    useEffect(() => {
        if (start.getHours() !== _start.getHours() || start.getDate() !== _start.getDate()) {
            setStart(_start);
            setEnd(new Date(_start.getTime() + 60 * 60 * 1000));
        }
    }, [_start, start]);

    useEffect(() => {
        if (_end && (end.getHours() !== _end.getHours() || end.getDate() !== _end.getDate())) {
            setEnd(_end);
        }
    }, [_end, end]);

    const possibleColors = ["default", "red", "orange", "yellow", "green", "teal", "cyan", "blue", "indigo", "purple", "pink"]
    const [color, setColor] = useState('default');

    const { locale } = useCalendar();
    const { t } = useTranslation();

    const handleSave = () => {
        sendMessage({
            type: 'add_event',
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
                    <DialogTitle>{t('add_event')}</DialogTitle>
                    <DialogDescription>
                        {format(_start, 'PP', { locale })}
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
