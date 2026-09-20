import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { index } from '@/routes/inventory';

type Stockable = {
    id: number;
    name: string;
    sku: string;
};

type StockMovement = {
    id: number;
    type: 'in' | 'out';
    quantity: string | number;
    reference_type: string | null;
    notes: string | null;
    stockable: Stockable;
    creator: { id: number; name: string };
    created_at: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedStockMovements = {
    data: StockMovement[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

type InventoryHistoryProps = {
    movements: PaginatedStockMovements;
};

function getMovementBadge(type: StockMovement['type']) {
    return type === 'in'
        ? {
              label: 'Masuk',
              variant: 'outline' as const,
              className: 'border-green-600 text-green-600',
          }
        : {
              label: 'Keluar',
              variant: 'destructive' as const,
              className: '',
          };
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
});

export default function InventoryHistory({ movements }: InventoryHistoryProps) {
    return (
        <>
            <Head title="Riwayat Pergerakan" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Riwayat Pergerakan
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Catatan seluruh pergerakan stok bahan baku dan produk
                        jadi.
                    </p>
                </div>

                <Card className="overflow-hidden border-sidebar-border/70 py-0 dark:border-sidebar-border">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase dark:border-sidebar-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-4 font-medium">
                                        Item
                                    </th>
                                    <th className="px-6 py-4 font-medium">
                                        Tipe
                                    </th>
                                    <th className="px-6 py-4 font-medium">
                                        Jumlah
                                    </th>
                                    <th className="px-6 py-4 font-medium">
                                        Sumber
                                    </th>
                                    <th className="px-6 py-4 font-medium">
                                        Dicatat oleh
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                {movements.data.length === 0 ? (
                                    <tr>
                                        <td
                                            className="px-6 py-12 text-center text-muted-foreground"
                                            colSpan={6}
                                        >
                                            Belum ada riwayat pergerakan stok.
                                        </td>
                                    </tr>
                                ) : (
                                    movements.data.map((movement) => {
                                        const typeBadge = getMovementBadge(
                                            movement.type,
                                        );

                                        return (
                                            <tr
                                                className="transition-colors hover:bg-muted/30"
                                                key={movement.id}
                                            >
                                                <td className="px-6 py-4">
                                                    {dateFormatter.format(
                                                        new Date(
                                                            movement.created_at,
                                                        ),
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium">
                                                        {
                                                            movement.stockable
                                                                .name
                                                        }
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {movement.stockable.sku}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge
                                                        className={
                                                            typeBadge.className
                                                        }
                                                        variant={
                                                            typeBadge.variant
                                                        }
                                                    >
                                                        {typeBadge.label}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {movement.quantity}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {movement.reference_type ??
                                                        '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {movement.creator.name}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {movements.last_page > 1 && (
                    <nav
                        aria-label="Pagination riwayat pergerakan stok"
                        className="flex flex-wrap justify-end gap-2"
                    >
                        {movements.links.map((link, linkIndex) =>
                            link.url ? (
                                <Link
                                    className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                                        link.active
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-sidebar-border/70 hover:bg-muted dark:border-sidebar-border'
                                    }`}
                                    href={link.url}
                                    key={`${link.label}-${linkIndex}`}
                                    preserveScroll
                                >
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                </Link>
                            ) : (
                                <span
                                    className="rounded-md border border-sidebar-border/40 px-3 py-2 text-sm text-muted-foreground"
                                    key={`${link.label}-${linkIndex}`}
                                >
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                </span>
                            ),
                        )}
                    </nav>
                )}
            </div>
        </>
    );
}

InventoryHistory.layout = {
    breadcrumbs: [
        {
            title: 'Inventaris',
            href: index(),
        },
        {
            title: 'Riwayat Pergerakan',
            href: '/inventory/history',
        },
    ],
};
