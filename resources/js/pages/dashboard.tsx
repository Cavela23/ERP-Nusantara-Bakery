import { Head } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    Boxes,
    ClipboardList,
    Factory,
    Package,
    Receipt,
    Truck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { dashboard } from '@/routes';

type DashboardMetrics = {
    revenueToday: number;
    revenueThisMonth: number;
    transactionsThisMonth: number;
    quantitySoldThisMonth: number;
};

type Product = { id: number; name: string; unit: string | null };
type BestsellingProduct = {
    product_id: number;
    total_qty: string | number;
    product: Product | null;
};
type StockAlert = {
    name: string;
    current_stock: number;
    stock_min: number;
    unit: string | null;
    jenis: 'bahan_baku' | 'produk_jadi';
};
type ProductionOrder = {
    id: number;
    production_number: string;
    quantity: string | number;
    production_date: string;
    status: string;
    product: Product | null;
};
type Distribution = {
    id: number;
    distribution_number: string;
    distribution_date: string;
    status: 'pending' | 'shipped';
    branch: { id: number; name: string } | null;
};

type DashboardProps = {
    metrics: DashboardMetrics;
    bestsellingProducts: BestsellingProduct[];
    lowStockAlerts: StockAlert[];
    recentProductionOrders: ProductionOrder[];
    activeDistributions: Distribution[];
};

const currencyFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

const quantityFormatter = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 3,
});

const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' });

function formatDate(value: string) {
    return dateFormatter.format(new Date(`${value.slice(0, 10)}T00:00:00`));
}

function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
        completed: 'Selesai',
        pending: 'Menunggu',
        shipped: 'Dikirim',
    };

    return labels[status] ?? status;
}

export default function Dashboard({
    metrics,
    bestsellingProducts,
    lowStockAlerts,
    recentProductionOrders,
    activeDistributions,
}: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-hidden p-4 md:p-6">
                <header className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Ringkasan operasional
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold">
                            Dashboard
                        </h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {dateFormatter.format(new Date())}
                    </p>
                </header>

                <section
                    aria-label="Kinerja bulan ini"
                    className="grid gap-4 md:grid-cols-3"
                >
                    <Card className="gap-4 border-l-4 border-l-emerald-600 p-5 shadow-none">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-muted-foreground">
                                Omzet
                            </p>
                            <Activity
                                className="size-4 text-emerald-700"
                                aria-hidden="true"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">
                                    Hari ini
                                </p>
                                <p
                                    className="mt-1 truncate text-lg font-semibold"
                                    title={currencyFormatter.format(
                                        metrics.revenueToday,
                                    )}
                                >
                                    {currencyFormatter.format(
                                        metrics.revenueToday,
                                    )}
                                </p>
                            </div>
                            <div className="min-w-0 border-l border-border pl-4">
                                <p className="text-xs text-muted-foreground">
                                    Bulan ini
                                </p>
                                <p
                                    className="mt-1 truncate text-lg font-semibold"
                                    title={currencyFormatter.format(
                                        metrics.revenueThisMonth,
                                    )}
                                >
                                    {currencyFormatter.format(
                                        metrics.revenueThisMonth,
                                    )}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="gap-4 border-l-4 border-l-sky-600 p-5 shadow-none">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-muted-foreground">
                                Transaksi bulan ini
                            </p>
                            <Receipt
                                className="size-4 text-sky-700"
                                aria-hidden="true"
                            />
                        </div>
                        <p className="text-3xl font-semibold">
                            {quantityFormatter.format(
                                metrics.transactionsThisMonth,
                            )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Transaksi penjualan tercatat
                        </p>
                    </Card>

                    <Card className="gap-4 border-l-4 border-l-amber-500 p-5 shadow-none">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-muted-foreground">
                                Produk terjual bulan ini
                            </p>
                            <Boxes
                                className="size-4 text-amber-700"
                                aria-hidden="true"
                            />
                        </div>
                        <p className="text-3xl font-semibold">
                            {quantityFormatter.format(
                                metrics.quantitySoldThisMonth,
                            )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Total kuantitas dari item penjualan
                        </p>
                    </Card>
                </section>

                <section className="grid min-w-0 gap-4 xl:grid-cols-2">
                    <Card className="min-w-0 gap-0 overflow-hidden py-0 shadow-none">
                        <div className="flex items-center gap-3 border-b border-sidebar-border/70 px-5 py-4 dark:border-sidebar-border">
                            <Package
                                className="size-4 text-muted-foreground"
                                aria-hidden="true"
                            />
                            <div>
                                <h2 className="font-semibold">
                                    Produk terlaris
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    5 produk dengan penjualan tertinggi bulan
                                    ini
                                </p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[440px] text-left text-sm">
                                <thead className="bg-muted/40 text-xs text-muted-foreground">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">
                                            Produk
                                        </th>
                                        <th className="px-5 py-3 text-right font-medium">
                                            Terjual
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                    {bestsellingProducts.length === 0 ? (
                                        <tr>
                                            <td
                                                className="px-5 py-8 text-center text-muted-foreground"
                                                colSpan={2}
                                            >
                                                Belum ada penjualan bulan ini.
                                            </td>
                                        </tr>
                                    ) : (
                                        bestsellingProducts.map(
                                            (item, index) => (
                                                <tr
                                                    key={item.product_id}
                                                    className="hover:bg-muted/30"
                                                >
                                                    <td className="px-5 py-3">
                                                        <span className="mr-3 inline-flex size-6 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                                                            {index + 1}
                                                        </span>
                                                        <span className="font-medium">
                                                            {item.product
                                                                ?.name ??
                                                                'Produk dihapus'}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3 text-right tabular-nums">
                                                        {quantityFormatter.format(
                                                            Number(
                                                                item.total_qty,
                                                            ),
                                                        )}{' '}
                                                        {item.product?.unit ??
                                                            ''}
                                                    </td>
                                                </tr>
                                            ),
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <Card className="min-w-0 gap-0 overflow-hidden py-0 shadow-none">
                        <div className="flex items-center gap-3 border-b border-sidebar-border/70 px-5 py-4 dark:border-sidebar-border">
                            <AlertTriangle
                                className="size-4 text-amber-600"
                                aria-hidden="true"
                            />
                            <div>
                                <h2 className="font-semibold">
                                    Alert stok menipis
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Stok saat ini sudah mencapai batas minimum
                                </p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[500px] text-left text-sm">
                                <thead className="bg-muted/40 text-xs text-muted-foreground">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">
                                            Item
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Jenis
                                        </th>
                                        <th className="px-5 py-3 text-right font-medium">
                                            Stok / minimum
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                    {lowStockAlerts.length === 0 ? (
                                        <tr>
                                            <td
                                                className="px-5 py-8 text-center text-muted-foreground"
                                                colSpan={3}
                                            >
                                                Tidak ada stok yang menipis.
                                            </td>
                                        </tr>
                                    ) : (
                                        lowStockAlerts.map((alert, index) => {
                                            const critical =
                                                alert.current_stock <= 0 ||
                                                alert.current_stock <=
                                                    alert.stock_min * 0.5;

                                            return (
                                                <tr
                                                    key={`${alert.jenis}-${alert.name}-${index}`}
                                                    className="hover:bg-muted/30"
                                                >
                                                    <td className="px-5 py-3 font-medium">
                                                        {alert.name}
                                                    </td>
                                                    <td className="px-5 py-3 text-muted-foreground">
                                                        {alert.jenis ===
                                                        'bahan_baku'
                                                            ? 'Bahan baku'
                                                            : 'Produk jadi'}
                                                    </td>
                                                    <td className="px-5 py-3 text-right">
                                                        <Badge
                                                            className={
                                                                critical
                                                                    ? ''
                                                                    : 'border-amber-300 bg-amber-100 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200'
                                                            }
                                                            variant={
                                                                critical
                                                                    ? 'destructive'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {quantityFormatter.format(
                                                                alert.current_stock,
                                                            )}{' '}
                                                            /{' '}
                                                            {quantityFormatter.format(
                                                                alert.stock_min,
                                                            )}{' '}
                                                            {alert.unit ?? ''}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </section>

                <Card className="gap-0 overflow-hidden py-0 shadow-none">
                    <div className="flex items-center gap-3 border-b border-sidebar-border/70 px-5 py-4 dark:border-sidebar-border">
                        <ClipboardList
                            className="size-4 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <div>
                            <h2 className="font-semibold">Aktivitas terbaru</h2>
                            <p className="text-xs text-muted-foreground">
                                Produksi dan distribusi yang perlu dipantau
                            </p>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2">
                        <section className="min-w-0 md:border-r md:border-sidebar-border/70 dark:md:border-sidebar-border">
                            <div className="flex items-center gap-2 border-b border-sidebar-border/70 px-5 py-3 text-sm font-medium dark:border-sidebar-border">
                                <Factory
                                    className="size-4 text-muted-foreground"
                                    aria-hidden="true"
                                />
                                Produksi terbaru
                            </div>
                            <ul className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                {recentProductionOrders.length === 0 ? (
                                    <li className="px-5 py-8 text-center text-sm text-muted-foreground">
                                        Belum ada produksi.
                                    </li>
                                ) : (
                                    recentProductionOrders.map((order) => (
                                        <li
                                            key={order.id}
                                            className="flex items-center justify-between gap-4 px-5 py-3"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">
                                                    {order.product?.name ??
                                                        'Produk dihapus'}
                                                </p>
                                                <p className="mt-1 truncate text-xs text-muted-foreground">
                                                    {order.production_number} -{' '}
                                                    {formatDate(
                                                        order.production_date,
                                                    )}
                                                </p>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <p className="text-sm font-medium">
                                                    {quantityFormatter.format(
                                                        Number(order.quantity),
                                                    )}{' '}
                                                    {order.product?.unit ?? ''}
                                                </p>
                                                <Badge
                                                    className="mt-1"
                                                    variant={
                                                        order.status ===
                                                        'completed'
                                                            ? 'outline'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {getStatusLabel(
                                                        order.status,
                                                    )}
                                                </Badge>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </section>

                        <section className="min-w-0">
                            <div className="flex items-center gap-2 border-b border-sidebar-border/70 px-5 py-3 text-sm font-medium dark:border-sidebar-border">
                                <Truck
                                    className="size-4 text-muted-foreground"
                                    aria-hidden="true"
                                />
                                Distribusi berjalan
                            </div>
                            <ul className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                {activeDistributions.length === 0 ? (
                                    <li className="px-5 py-8 text-center text-sm text-muted-foreground">
                                        Tidak ada distribusi berjalan.
                                    </li>
                                ) : (
                                    activeDistributions.map((distribution) => (
                                        <li
                                            key={distribution.id}
                                            className="flex items-center justify-between gap-4 px-5 py-3"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">
                                                    {distribution.branch
                                                        ?.name ??
                                                        'Cabang dihapus'}
                                                </p>
                                                <p className="mt-1 truncate text-xs text-muted-foreground">
                                                    {
                                                        distribution.distribution_number
                                                    }{' '}
                                                    -{' '}
                                                    {formatDate(
                                                        distribution.distribution_date,
                                                    )}
                                                </p>
                                            </div>
                                            <Badge
                                                className="shrink-0"
                                                variant={
                                                    distribution.status ===
                                                    'shipped'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {getStatusLabel(
                                                    distribution.status,
                                                )}
                                            </Badge>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </section>
                    </div>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
