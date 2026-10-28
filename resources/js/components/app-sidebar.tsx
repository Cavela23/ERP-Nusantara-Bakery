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
    const roles = auth.user?.roles?.map((role) => role.name) ?? [];
    const isOwner = roles.includes('owner');
    const canPurchase = isOwner || roles.includes('purchasing_staff');
    const canReceivePurchases = isOwner || roles.includes('staff_gudang');
    const canManageInventory = isOwner || roles.includes('staff_gudang');
    const canManageProduction = isOwner || roles.includes('kepala_produksi');
    const canSell = isOwner || roles.includes('kasir');
    const navigationItems = mainNavItems
        .map((item) => {
            if (item.title === 'Master Data' || item.title === 'Reporting') {
                return isOwner ? item : null;
            }

            if (item.title === 'Purchasing') {
                return canPurchase || canReceivePurchases ? item : null;
            }

            if (item.title === 'Inventory' || item.title === 'Distribution') {
                return canManageInventory ? item : null;
            }

            if (item.title === 'Production') {
                if (!canManageProduction) {
                    return null;
                }

                return isOwner
                    ? item
                    : {
                          ...item,
                          items: item.items?.filter(
                              (child) => child.title !== 'Bill of Materials',
                          ),
                      };
            }

            if (item.title === 'POS') {
                return canSell ? item : null;
            }

            return item;
        })
        .filter((item): item is NavItem => item !== null);
    if (isOwner) {
        navigationItems.push({
            title: 'Manajemen User',
            href: '/users',
            icon: Users,
        });
    }

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
