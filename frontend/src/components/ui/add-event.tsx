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
import { useCalendar } from '@/components/ui/full-calendar';

import { format } from 'date-fns';

import { useTranslation } from 'react-i18next';
import { useWebSocketContext } from '@/lib/websocket-context';
import { EventForm } from './event-form';

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
    const [color, setColor] = useState<'default' | 'blue' | 'green' | 'pink' | 'purple' | 'red' | 'yellow' | 'teal' | 'cyan' | 'orange' | 'indigo'>('default');

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
