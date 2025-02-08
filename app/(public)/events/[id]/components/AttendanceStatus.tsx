import { format } from 'date-fns';
import { CheckCircle } from 'lucide-react';

interface AttendanceStatusProps {
    attendedAt: Date;
}

export function AttendanceStatus({ attendedAt }: AttendanceStatusProps) {
    return (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-3">
                    <h3 className="text-lg font-medium text-green-800 dark:text-green-200">
                        Attendance Confirmed
                    </h3>
                    <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                        <p>
                            You marked your attendance on{' '}
                            {format(new Date(attendedAt), 'MMMM d, yyyy')} at{' '}
                            {format(new Date(attendedAt), 'h:mm a')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
