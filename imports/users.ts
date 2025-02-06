import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

interface OldUser {
    id: string;
    name: string;
    type: string;
    username: string;
    email: string;
    bio: string;
    phone: string;
    student_id: string;
    codeforces_username: string;
    vjudge_username: string;
    atcoder_username: string;
    email_verified_at: string;
    password: string;
    deleted_at: string | null;
    remember_token: string | null;
    created_at: string;
    updated_at: string;
}

interface JsonData {
    type: string;
    version?: string;
    comment?: string;
    name?: string;
    database?: string;
    data?: OldUser[];
}

async function importUsers() {
    try {
        // Read the JSON file
        const jsonData = await fs.readFile(
            path.join(process.cwd(), 'old-data', 'users.json'),
            'utf-8'
        );
        const data: JsonData[] = JSON.parse(jsonData);

        // Find the users table data
        const usersTable = data.find((item) => item.type === 'table' && item.name === 'users');

        if (!usersTable?.data) {
            throw new Error('No users data found in the JSON file');
        }

        console.log(`Found ${usersTable.data.length} users to import`);

        // Import each user
        for (const oldUser of usersTable.data) {
            try {
                const newUser = await prisma.user.create({
                    data: {
                        id: oldUser.id, // Note: This assumes IDs are compatible. If not, remove this line to use auto-generated CUIDs
                        name: oldUser.name,
                        email: oldUser.email,
                        username: oldUser.username,
                        emailVerified: oldUser.email_verified_at ? new Date(oldUser.email_verified_at) : null,
                        password: oldUser.password,
                        phone: oldUser.phone,
                        codeforcesHandle: oldUser.codeforces_username || null,
                        atcoderHandle: oldUser.atcoder_username || null,
                        vjudgeHandle: oldUser.vjudge_username || null,
                        studentId: oldUser.student_id || null,
                        createdAt: new Date(oldUser.created_at),
                        updatedAt: new Date(oldUser.updated_at),
                    },
                });
                console.log(`Imported user: ${newUser.email}`);
            } catch (error) {
                console.error(`Failed to import user ${oldUser.email}:`, error);
            }
        }

        console.log('Import completed successfully');
    } catch (error) {
        console.error('Import failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the import
importUsers()
    .then(() => {
        console.log('Import process finished');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Import process failed:', error);
        process.exit(1);
    });