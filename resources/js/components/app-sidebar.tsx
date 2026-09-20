import { Link } from '@inertiajs/react';
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
import {
    Boxes,
    ChartNoAxesCombined,
    ClipboardList,
    Factory,
    LayoutGrid,
    Package,
    ShoppingCart,
    Truck,
    BookOpen, 
    FolderGit2
} from 'lucide-react';
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
    },
    {
        title: 'Distribution',
        href: '#',
        icon: Truck,
    },
    {
        title: 'POS',
        href: '#',
        icon: ShoppingCart,
    },
     {
        title: 'Reporting',
        href: '#',
        icon: ChartNoAxesCombined,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
