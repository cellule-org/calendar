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

import { CalendarEvent, useCalendar } from '@/components/ui/full-calendar';

import { format } from 'date-fns';

import { useTranslation } from 'react-i18next';
import { useWebSocketContext } from '@/lib/websocket-context';
import { EventForm } from './event-form';

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
    const [color, setColor] = useState(event ? event.color || 'default' : 'default');

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
                <EventForm
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    start={start}
                    setStart={setStart}
                    end={end}
                    setEnd={setEnd}
                    color={color}
                    setColor={setColor}
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button onClick={handleSave}>
                            {t('save')}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
