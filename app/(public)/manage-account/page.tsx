// app/manage-account/page.tsx
import {redirect} from 'next/navigation';
import {auth} from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import AccountTabs from './components/AccountTabs';


export default async function ManageAccountPage() {
    const session = await auth();
    if (!session?.user) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: {id: session.user.id}
    });

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-b from-blue-50/20 to-transparent dark:from-blue-900/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Account Settings
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Manage your profile, security, and account preferences
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AccountTabs user={user}/>
                </div>
            </section>
        </div>
    );
}