import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { history, index } from '@/routes/inventory';

type StockItem = {
    id: number;
    name: string;
    sku: string;
    unit: string;
    stock_min: string | number;
    current_stock: string | number;
};

type InventoryIndexProps = {
    rawMaterials: StockItem[];
    products: StockItem[];
};

function getStockStatus(current: number, min: number) {
    if (current <= 0) {
        return {
            label: 'Habis',
            variant: 'destructive' as const,
            className: '',
        };
    }

    if (current <= min) {
        return {
            label: 'Menipis',
            variant: 'outline' as const,
            className: 'border-amber-600 text-amber-600',
        };
    }

    return {
        label: 'Aman',
        variant: 'outline' as const,
        className: 'border-green-600 text-green-600',
    };
}

function StockTable({ items }: { items: StockItem[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase dark:border-sidebar-border">
                    <tr>
                        <th className="px-6 py-4 font-medium">Nama</th>
                        <th className="px-6 py-4 font-medium">SKU</th>
                        <th className="px-6 py-4 font-medium">Stok Saat Ini</th>
                        <th className="px-6 py-4 font-medium">Stok Minimum</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                    {items.length === 0 ? (
                        <tr>
                            <td
                                className="px-6 py-12 text-center text-muted-foreground"
                                colSpan={5}
                            >
                                Belum ada data stok.
                            </td>
                        </tr>
                    ) : (
                        items.map((item) => {
                            const currentStock = Number(item.current_stock);
                            const minimumStock = Number(item.stock_min);
                            const status = getStockStatus(
                                currentStock,
                                minimumStock,
                            );

                            return (
                                <tr
                                    className="transition-colors hover:bg-muted/30"
                                    key={item.id}
                                >
                                    <td className="px-6 py-4 font-medium">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {item.sku}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.current_stock} {item.unit}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.stock_min} {item.unit}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            className={status.className}
                                            variant={status.variant}
                                        >
                                            {status.label}
                                        </Badge>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default function InventoryIndex({
    rawMaterials,
    products,
}: InventoryIndexProps) {
    return (
        <>
            <Head title="Inventaris" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Inventaris
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Pantau ketersediaan bahan baku dan produk jadi.
                        </p>
                    </div>

                    <Link
                        className="rounded-md border border-sidebar-border/70 px-3 py-2 text-sm font-medium transition-colors hover:bg-muted dark:border-sidebar-border"
                        href={history()}
                    >
                        Riwayat Pergerakan
                    </Link>
                </div>

                <div className="grid gap-6">
                    <Card className="overflow-hidden border-sidebar-border/70 py-0 dark:border-sidebar-border">
                        <div className="border-b border-sidebar-border/70 px-6 py-4 dark:border-sidebar-border">
                            <h2 className="font-semibold">Stok Bahan Baku</h2>
                        </div>
                        <StockTable items={rawMaterials} />
                    </Card>

                    <Card className="overflow-hidden border-sidebar-border/70 py-0 dark:border-sidebar-border">
                        <div className="border-b border-sidebar-border/70 px-6 py-4 dark:border-sidebar-border">
                            <h2 className="font-semibold">Stok Produk Jadi</h2>
                        </div>
                        <StockTable items={products} />
                    </Card>
                </div>
            </div>
        </>
    );
}

InventoryIndex.layout = {
    breadcrumbs: [
        {
            title: 'Inventaris',
            href: index(),
        },
    ],
};
