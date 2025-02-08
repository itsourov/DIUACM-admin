import { ContestStatOfUser, User } from '@prisma/client';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface ContestStatsTableProps {
    stats: (ContestStatOfUser & { user: User })[];
}

export function ContestStatsTable({ stats }: ContestStatsTableProps) {
    // Sort stats by solve count (desc), then upsolve count (desc)
    const sortedStats = [...stats].sort((a, b) => {
        if (a.isAbsent && !b.isAbsent) return 1;
        if (!a.isAbsent && b.isAbsent) return -1;
        if (a.solveCount !== b.solveCount) return b.solveCount - a.solveCount;
        return b.upsolveCount - a.upsolveCount;
    });

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="px-4 py-3">Rank</th>
                        <th className="px-4 py-3">Participant</th>
                        <th className="px-4 py-3 text-center">Contest Solves</th>
                        <th className="px-4 py-3 text-center">Upsolves</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3">Last Updated</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedStats.map((stat, index) => (
                        <tr key={stat.id} className={`
                            ${stat.isAbsent ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'}
                        `}>
                            <td className="px-4 py-3 font-medium">
                                {stat.isAbsent ? '-' : `#${index + 1}`}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex flex-col">
                                    <span>{stat.user.name}</span>
                                    {stat.note && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {stat.note}
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                                <Badge variant={stat.solveCount > 0 ? "success" : "secondary"}>
                                    {stat.solveCount}
                                </Badge>
                            </td>
                            <td className="px-4 py-3 text-center">
                                <Badge variant={stat.upsolveCount > 0 ? "default" : "secondary"}>
                                    {stat.upsolveCount}
                                </Badge>
                            </td>
                            <td className="px-4 py-3 text-center">
                                {stat.isAbsent ? (
                                    <span className="inline-flex items-center text-red-500 dark:text-red-400">
                                        <XCircle className="w-4 h-4 mr-1" />
                                        Absent
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center text-green-500 dark:text-green-400">
                                        <CheckCircle2 className="w-4 h-4 mr-1" />
                                        Present
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                <span className="inline-flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {format(new Date(stat.lastUpdated), 'MMM d, HH:mm')}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {stats.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No contest statistics available yet.
                </div>
            )}
        </div>
    );
}
