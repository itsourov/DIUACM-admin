// components/many-to-many/relation-manager.tsx
'use client';

import { JSX, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    BaseItem,
    PivotField,
    RelationConfig,
    ItemWithPivot,
    PivotFieldValue,
    PivotData
} from '@/types/many-to-many';
import { formatUTCDateTime } from '@/lib/utils/date';

interface RelationManagerProps<T extends BaseItem, P extends PivotData> {
    sourceId: string;
    items: T[];
    selectedItems: ItemWithPivot<T, P>[];
    config: RelationConfig<P>;
    onAttach: (targetId: string, pivotData: P) => Promise<{ success: boolean; error?: string }>;
    onDetach: (targetId: string) => Promise<{ success: boolean; error?: string }>;
    onUpdatePivot: (targetId: string, pivotData: P) => Promise<{ success: boolean; error?: string }>;
    onSearch: (search: string, page: number) => Promise<void>;
    onPaginate?: (page: number) => Promise<void>;
    totalPages?: number;
    currentPage?: number;
}

export function RelationManager<T extends BaseItem, P extends PivotData>({
                                                                             items,
                                                                             selectedItems,
                                                                             config,
                                                                             onAttach,
                                                                             onDetach,
                                                                             onUpdatePivot,
                                                                             onSearch,
                                                                             onPaginate,
                                                                             totalPages = 1,
                                                                             currentPage = 1,
                                                                         }: RelationManagerProps<T, P>) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<Record<string, P>>({});
    const [page, setPage] = useState(currentPage);
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();

    const handleSearch = (value: string) => {
        setSearch(value);

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
            onSearch(value, 1);
            setPage(1);
        }, 300);

        setSearchTimeout(timeout);
    };

    const handlePivotChange = (
        itemId: string,
        field: keyof P,
        value: PivotFieldValue
    ) => {
        setEditData(prev => ({
            ...prev,
            [itemId]: {
                ...(prev[itemId] || {}) as P,
                [field]: value
            }
        }));
    };

    const renderPivotField = (
        item: ItemWithPivot<T, P>,
        field: PivotField<P>
    ): JSX.Element => {
        const currentValue = (editData[item.id]?.[field.key] ?? item.pivot[field.key]) as PivotFieldValue;

        if (field.readonly) {
            let displayValue: string;
            if (field.type === 'date' && currentValue instanceof Date) {
                displayValue = formatUTCDateTime(currentValue);
            } else {
                displayValue = String(currentValue);
            }
            return <span className="text-muted-foreground">{displayValue}</span>;
        }

        let inputValue: string = '';
        if (field.type === 'date' && currentValue instanceof Date) {
            inputValue = currentValue.toISOString().split('T')[0];
        } else if (field.type === 'number' && field.validation?.precision !== undefined) {
            inputValue = Number(currentValue).toFixed(field.validation.precision);
        } else {
            inputValue = String(currentValue);
        }

        return (
            <Input
                type={field.type}
                value={inputValue}
                onChange={(e) => {
                    let newValue: PivotFieldValue;
                    if (field.type === 'number') {
                        const parsed = parseFloat(e.target.value);
                        if (!isNaN(parsed)) {
                            if (field.validation?.precision !== undefined) {
                                newValue = Number(parsed.toFixed(field.validation.precision));
                            } else {
                                newValue = parsed;
                            }
                        } else {
                            newValue = field.defaultValue;
                        }
                    } else if (field.type === 'date') {
                        newValue = new Date(e.target.value);
                    } else {
                        newValue = e.target.value;
                    }
                    handlePivotChange(item.id, field.key, newValue);
                }}
                className="w-[100px]"
                min={field.validation?.min}
                max={field.validation?.max}
                step={field.validation?.step}
                pattern={field.validation?.pattern}
                required={field.validation?.required}
                disabled={field.readonly}
            />
        );
    };

    const handleAttach = async (targetId: string) => {
        setLoading(targetId);
        try {
            const pivotData = config.pivotFields.reduce((acc, field) => ({
                ...acc,
                [field.key]: field.defaultValue
            }), {}) as P;

            const result = await onAttach(targetId, pivotData);
            if (result.success) {
                toast.success(`${config.title} attached successfully`);
                setOpen(false);
            } else {
                toast.error(result.error || `Failed to attach ${config.title}`);
            }
        } catch (error) {
            toast.error(`Failed to attach ${config.title}. ${error}`);
        } finally {
            setLoading(null);
        }
    };

    const handleDetach = async (targetId: string) => {
        setLoading(targetId);
        try {
            const result = await onDetach(targetId);
            if (result.success) {
                toast.success(`${config.title} detached successfully`);
            } else {
                toast.error(result.error || `Failed to detach ${config.title}`);
            }
        } catch (error) {
            toast.error(`Failed to detach ${config.title}. ${error}`);
        } finally {
            setLoading(null);
        }
    };

    const handleUpdatePivot = async (targetId: string) => {
        setLoading(targetId);
        try {
            const data = editData[targetId];
            if (!data) return;

            const result = await onUpdatePivot(targetId, data);
            if (result.success) {
                toast.success('Updated successfully');
                setEditingId(null);
                setEditData(prev => {
                    const newData = { ...prev };
                    delete newData[targetId];
                    return newData;
                });
            } else {
                toast.error(result.error || 'Failed to update');
            }
        } catch (error) {
            toast.error('Failed to update. ' + error);
        } finally {
            setLoading(null);
        }
    };

    const handlePageChange = async (newPage: number) => {
        if (onPaginate) {
            setPage(newPage);
            await onPaginate(newPage);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{config.title}</h3>
                <Button onClick={() => setOpen(true)}>
                    Add {config.title}
                </Button>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            {config.pivotFields.map(field => (
                                <TableHead key={String(field.key)}>{field.label}</TableHead>
                            ))}
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {selectedItems.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={config.pivotFields.length + 2}
                                    className="text-center text-muted-foreground"
                                >
                                    No {config.title.toLowerCase()} attached
                                </TableCell>
                            </TableRow>
                        ) : (
                            selectedItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.title}</TableCell>
                                    {config.pivotFields.map(field => (
                                        <TableCell key={String(field.key)}>
                                            {editingId === item.id ? (
                                                renderPivotField(item, field)
                                            ) : (
                                                field.type === 'date' && item.pivot[field.key] instanceof Date ? (
                                                    formatUTCDateTime(item.pivot[field.key] as Date)
                                                ) : (
                                                    String(item.pivot[field.key])
                                                )
                                            )}
                                        </TableCell>
                                    ))}
                                    <TableCell className="text-right">
                                        {editingId === item.id ? (
                                            <div className="space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setEditingId(null);
                                                        setEditData(prev => {
                                                            const newData = { ...prev };
                                                            delete newData[item.id];
                                                            return newData;
                                                        });
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleUpdatePivot(item.id)}
                                                    disabled={loading === item.id}
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setEditingId(item.id)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDetach(item.id)}
                                                    disabled={loading === item.id}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Add {config.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder={config.searchPlaceholder || `Search ${config.title.toLowerCase()}...`}
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center text-muted-foreground">
                                                No items found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.title}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleAttach(item.id)}
                                                        disabled={loading === item.id}
                                                    >
                                                        Add
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <span className="px-4 py-2">
                                    Page {page} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
