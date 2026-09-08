import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { create, destroy, edit, index } from '@/routes/suppliers';

type Supplier = {
    id: number;
    name: string;
    contact_person: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedSuppliers = {
    data: Supplier[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

type SuppliersIndexProps = {
    suppliers: PaginatedSuppliers;
};

export default function SuppliersIndex({ suppliers }: SuppliersIndexProps) {
    function handleDelete(supplier: Supplier) {
        if (!window.confirm(`Hapus supplier "${supplier.name}"?`)) {
            return;
        }

        router.delete(destroy.url(supplier.id), {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Suppliers" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Suppliers
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola data pemasok bahan bakery.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href={create()}>Tambah Supplier</Link>
                    </Button>
                </div>

                <Card className="overflow-hidden border-sidebar-border/70 py-0 dark:border-sidebar-border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground dark:border-sidebar-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Nama</th>
                                    <th className="px-6 py-4 font-medium">Contact Person</th>
                                    <th className="px-6 py-4 font-medium">Telepon</th>
                                    <th className="px-6 py-4 font-medium">Email</th>
                                    <th className="px-6 py-4 font-medium">Alamat</th>
                                    <th className="px-6 py-4 text-right font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                {suppliers.data.length === 0 ? (
                                    <tr>
                                        <td
                                            className="px-6 py-12 text-center text-muted-foreground"
                                            colSpan={6}
                                        >
                                            Belum ada supplier.
                                        </td>
                                    </tr>
                                ) : (
                                    suppliers.data.map((supplier) => (
                                        <tr
                                            className="transition-colors hover:bg-muted/30"
                                            key={supplier.id}
                                        >
                                            <td className="px-6 py-4 font-medium">
                                                {supplier.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {supplier.contact_person || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {supplier.phone || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {supplier.email || '-'}
                                            </td>
                                            <td className="max-w-xs px-6 py-4 text-muted-foreground">
                                                {supplier.address || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <Link href={edit(supplier.id)}>
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleDelete(supplier)
                                                        }
                                                    >
                                                        Hapus
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {suppliers.last_page > 1 && (
                    <nav
                        aria-label="Pagination suppliers"
                        className="flex flex-wrap justify-end gap-2"
                    >
                        {suppliers.links.map((link, linkIndex) =>
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

SuppliersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Suppliers',
            href: index(),
        },
    ],
};