'use client';

import {useState} from 'react';
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {toast} from 'sonner';
import {EventFormData} from "../schema";
import {fetchContestData} from '../actions/fetch-contest-info';

interface QuickFillContestModalProps {
    onFill: (data: EventFormData) => void;
    isEditing?: boolean;
}

export function QuickFillContestModal({onFill, isEditing = false}: QuickFillContestModalProps) {
    const [open, setOpen] = useState(false);
    const [contestLink, setContestLink] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!contestLink) {
            toast.error('Please enter a contest link');
            return;
        }

        if (isEditing) {
            const confirmed = window.confirm(
                'You are editing an existing event. Are you sure you want to override the current data?'
            );
            if (!confirmed) return;
        }

        setIsLoading(true);
        try {
            const result = await fetchContestData(contestLink);

            if (result.error) {
                toast.error(result.error);
                return;
            }

            if (result.data) {
                onFill(result.data);
                setOpen(false);
                setContestLink('');
                toast.success('Contest data filled successfully');
            }
        } catch (error) {
            console.error('Error fetching contest data:', error);
            toast.error('Failed to fetch contest data');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="mb-6">
                    Quick Fill Contest
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Quick Fill Contest Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="Enter contest URL (Codeforces/VJudge)"
                            value={contestLink}
                            onChange={(e) => setContestLink(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? 'Fetching...' : 'Fill Contest Data'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}