import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    create,
    destroy,
    edit,
    index,
    markAsOrdered,
    receive,
} from '@/routes/purchasing';

type Supplier = { id: number; name: string };
type PurchaseOrder = {
    id: number;
    po_number: string;
    supplier: Supplier;
    order_date: string;
    expected_date: string | null;
    status: 'draft' | 'ordered' | 'received' | 'cancelled';
    total_amount: string | number;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedPurchaseOrders = {
    data: PurchaseOrder[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

type PurchasingIndexProps = {
    purchaseOrders: PaginatedPurchaseOrders;
};

function getStatusBadge(status: string) {
    switch (status) {
        case 'draft':
            return { variant: 'secondary' as const, className: '' };
        case 'ordered':
            return { variant: 'default' as const, className: '' };
        case 'received':
            return {
                variant: 'outline' as const,
                className: 'border-green-600 text-green-600',
            };
        case 'cancelled':
            return { variant: 'destructive' as const, className: '' };
        default:
            return { variant: 'secondary' as const, className: '' };
    }
}

const currencyFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
});

export default function PurchasingIndex({
    purchaseOrders,
}: PurchasingIndexProps) {
    function handleDelete(purchaseOrder: PurchaseOrder) {
        if (purchaseOrder.status === 'received') {
            return;
        }

        if (!window.confirm(`Hapus PO "${purchaseOrder.po_number}"?`)) {
            return;
        }

        router.delete(destroy.url(purchaseOrder.id), {
            preserveScroll: true,
        });
    }

    function handleMarkAsOrdered(purchaseOrder: PurchaseOrder) {
        if (
            !window.confirm(
                `Tandai PO "${purchaseOrder.po_number}" sebagai dipesan?`,
            )
        ) {
            return;
        }

        router.post(
            markAsOrdered.url(purchaseOrder.id),
            {},
            { preserveScroll: true },
        );
    }

    function handleReceive(purchaseOrder: PurchaseOrder) {
        if (
            !window.confirm(
                `Konfirmasi barang untuk PO "${purchaseOrder.po_number}" sudah diterima?`,
            )
        ) {
            return;
        }

        router.post(
            receive.url(purchaseOrder.id),
            {},
            { preserveScroll: true },
        );
    }

    return (
        <>
            <Head title="Purchase Orders" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Purchase Orders
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola pesanan pembelian bahan bakery.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href={create()}>Buat PO</Link>
                    </Button>
                </div>

                <Card className="overflow-hidden border-sidebar-border/70 py-0 dark:border-sidebar-border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase dark:border-sidebar-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium">
                                        No. PO
                                    </th>
                                    <th className="px-6 py-4 font-medium">
                                        Supplier
                                    </th>
                                    <th className="px-6 py-4 font-medium">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-4 font-medium">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-right font-medium">
                                        Total
                                    </th>
                                    <th className="px-6 py-4 text-right font-medium">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                {purchaseOrders.data.length === 0 ? (
                                    <tr>
                                        <td
                                            className="px-6 py-12 text-center text-muted-foreground"
                                            colSpan={6}
                                        >
                                            Belum ada purchase order.
                                        </td>
                                    </tr>
                                ) : (
                                    purchaseOrders.data.map((purchaseOrder) => {
                                        const statusBadge = getStatusBadge(
                                            purchaseOrder.status,
                                        );

                                        return (
                                            <tr
                                                className="transition-colors hover:bg-muted/30"
                                                key={purchaseOrder.id}
                                            >
                                                <td className="px-6 py-4 font-medium">
                                                    {purchaseOrder.po_number}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {
                                                        purchaseOrder.supplier
                                                            .name
                                                    }
                                                </td>
                                                <td className="px-6 py-4">
                                                    {dateFormatter.format(
                                                        new Date(
                                                            purchaseOrder.order_date,
                                                        ),
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge
                                                        className={
                                                            statusBadge.className
                                                        }
                                                        variant={
                                                            statusBadge.variant
                                                        }
                                                    >
                                                        {purchaseOrder.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {currencyFormatter.format(
                                                        Number(
                                                            purchaseOrder.total_amount,
                                                        ),
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        {purchaseOrder.status ===
                                                        'received' ? (
                                                            <span className="px-3 py-2 text-xs text-muted-foreground">
                                                                Terkunci
                                                            </span>
                                                        ) : (
                                                            <>
                                                                {purchaseOrder.status ===
                                                                    'draft' && (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="secondary"
                                                                        onClick={() =>
                                                                            handleMarkAsOrdered(
                                                                                purchaseOrder,
                                                                            )
                                                                        }
                                                                    >
                                                                        Tandai
                                                                        Dipesan
                                                                    </Button>
                                                                )}
                                                                {purchaseOrder.status ===
                                                                    'ordered' && (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="default"
                                                                        onClick={() =>
                                                                            handleReceive(
                                                                                purchaseOrder,
                                                                            )
                                                                        }
                                                                    >
                                                                        Terima
                                                                        Barang
                                                                    </Button>
                                                                )}
                                                                <Button
                                                                    asChild
                                                                    size="sm"
                                                                    variant="outline"
                                                                >
                                                                    <Link
                                                                        href={edit(
                                                                            purchaseOrder.id,
                                                                        )}
                                                                    >
                                                                        Edit
                                                                    </Link>
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            purchaseOrder,
                                                                        )
                                                                    }
                                                                >
                                                                    Hapus
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {purchaseOrders.last_page > 1 && (
                    <nav
                        aria-label="Pagination purchase orders"
                        className="flex flex-wrap justify-end gap-2"
                    >
                        {purchaseOrders.links.map((link, linkIndex) =>
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

PurchasingIndex.layout = {
    breadcrumbs: [
        {
            title: 'Purchase Orders',
            href: index(),
        },
    ],
};
