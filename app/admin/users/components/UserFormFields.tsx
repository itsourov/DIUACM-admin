// app/admin/users/components/UserFormFields.tsx

'use client';

import {useFormContext} from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {UserFormData} from "../schema";

const GENDER_OPTIONS = [
    {value: 'MALE', label: 'Male'},
    {value: 'FEMALE', label: 'Female'},
    {value: 'OTHER', label: 'Other'},
];

export function UserFormFields() {
    const form = useFormContext<UserFormData>();

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Name Field */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter full name"
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Email Field */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="user@example.com"
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Username Field */}
                <FormField
                    control={form.control}
                    name="username"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Username <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter username"
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Password Field */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                {form.getValues('username') ? 'New Password' : 'Password'}
                                {!form.getValues('username') && <span className="text-red-500">*</span>}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Enter password"
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormDescription>
                                {form.getValues('username')
                                    ? 'Leave blank to keep current password'
                                    : 'Minimum 6 characters'}
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                {/* Gender Field */}
                <FormField
                    control={form.control}
                    name="gender"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value ?? undefined}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {GENDER_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Phone Field */}
                <FormField
                    control={form.control}
                    name="phone"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter phone number"
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </div>

            {/* Coding Platform Handles Section */}
            <div className="grid gap-6 md:grid-cols-3">
                <FormField
                    control={form.control}
                    name="codeforcesHandle"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Codeforces Handle</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Codeforces username"
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="atcoderHandle"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>AtCoder Handle</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="AtCoder username"
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="vjudgeHandle"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>VJudge Handle</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="VJudge username"
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </div>

            {/* University Information Section */}
            <div className="grid gap-6 md:grid-cols-3">
                <FormField
                    control={form.control}
                    name="startingSemester"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Starting Semester</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., Fall 2023"
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="department"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Department</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., Computer Science"
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="studentId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Student ID</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter student ID"
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}