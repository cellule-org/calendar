import React, { useState } from 'react';

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCalendar } from '@/components/ui/full-calendar';

import { format } from 'date-fns';

import { useTranslation } from 'react-i18next';

interface AddEventModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    date?: Date;
    endDate?: Date;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
    isOpen,
    onOpenChange,
    date = new Date(),
    endDate,
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [start, setStart] = useState(format(date, 'HH:mm'));
    const [end, setEnd] = useState(endDate ? format(endDate, 'HH:mm') : format(new Date(date.getTime() + 60 * 60 * 1000), 'HH:mm'));

    const possibleColors = ["default", "red", "orange", "yellow", "green", "teal", "cyan", "blue", "indigo", "purple", "pink"]
    const [color, setColor] = useState('default');

    const { locale } = useCalendar();
    const { t } = useTranslation();

    const handleSave = () => {
        const start = format(date, 'HH:mm');
        console.log({ title, description, start, end, color, date });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger className='hidden'>Add Event
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('add_event')}</DialogTitle>
                    <DialogDescription>
                        {format(date, 'PP', { locale })}
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
                        <Input id='start' value={start} onChange={(e) => setStart(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="end" >
                            {t('end')}
                        </Label>
                        <Input id='end' value={end} onChange={(e) => setEnd(e.target.value)} />
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
                                    className={`rounded-full h-6 w-6 bg-${c}-500 border-2 border-gray-300 focus:outline-none ${color === c ? `border-${c}-700` : ''}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleSave}
                    >
                        {t('save')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
