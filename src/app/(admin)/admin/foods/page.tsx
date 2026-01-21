'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FoodsPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the first child route (Category)
        router.replace('/admin/foods/category');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <p className="text-gray-600">Redirecting...</p>
            </div>
        </div>
    );
}
