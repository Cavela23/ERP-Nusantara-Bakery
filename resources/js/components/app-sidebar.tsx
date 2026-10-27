import { Link } from '@inertiajs/react';
import {
    Boxes,
    ChartNoAxesCombined,
    Factory,
    FolderGit2,
    LayoutGrid,
    Package,
    ShoppingCart,
    Truck,
    BookOpen,
    Users,
} from 'lucide-react';
import { usePage } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Master Data',
        href: '#',
        icon: Boxes,
        items: [
            {
                title: 'Products',
                href: '/products',
            },
            {
                title: 'Categories',
                href: '/categories',
            },
            {
                title: 'Suppliers',
                href: '/suppliers',
            },
            {
                title: 'Raw Materials',
                href: '/raw-materials',
            },
            {
                title: 'Branches',
                href: '/branches',
            },
        ],
    },
    {
        title: 'Purchasing',
        href: '#',
        icon: ShoppingCart,
        items: [
            {
                title: 'Purchase Orders',
                href: '/purchasing',
            },
        ],
    },
    {
        title: 'Inventory',
        href: '/inventory',
        icon: Package,
    },
    {
        title: 'Production',
        href: '#',
        icon: Factory,
        items: [
            {
                title: 'Bill of Materials',
                href: '/bill-of-materials',
            },
            {
                title: 'Production Orders',
                href: '/production-orders',
            },
        ],
    },
    {
        title: 'Distribution',
        href: '/distributions',
        icon: Truck,
    },
    {
        title: 'POS',
        href: '/sales',
        icon: ShoppingCart,
        items: [
            {
                title: 'Buat Transaksi',
                href: '/sales/create',
            },
            {
                title: 'Riwayat Penjualan',
                href: '/sales',
            },
        ],
    },
    {
        title: 'Reporting',
        href: '#',
        icon: ChartNoAxesCombined,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage().props as {
        auth: { user: { roles?: { name: string }[] } | null };
    };
    const canManageUsers = auth.user?.roles?.some((role) => role.name === 'owner');
    const navigationItems = canManageUsers
        ? [
              ...mainNavItems,
              { title: 'Manajemen User', href: '/users', icon: Users },
          ]
        : mainNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navigationItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
