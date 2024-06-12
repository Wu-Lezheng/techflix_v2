'use client';

import Sidebar from '@/components/sidebar/Sidebar';
import Topbar from '@/components/topbar/Topbar';
import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export const Providers = ({ children }) => {

    const pathname = usePathname();
    const shouldRender = pathname !== "/login" && pathname !== "/";

    return (
        <SessionProvider>
            {shouldRender && <Sidebar />}
            {shouldRender && <Topbar />}
            {children}
        </SessionProvider>
    )
}