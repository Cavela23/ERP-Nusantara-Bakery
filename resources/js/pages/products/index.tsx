import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { create, destroy, edit, index } from '@/routes/products';

type Category = {
    id: number;
    name: string;
};

type Product = {
    id: number;
    name: string;
    category: Category;
    sku: string;
    price: string | number;
    unit: string;
    stock_min: string | number;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedProducts = {
    data: Product[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

type ProductsIndexProps = {
    products: PaginatedProducts;
};

const currencyFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 2,
});

export default function ProductsIndex({
    products,
}: ProductsIndexProps) {
    function handleDelete(product: Product) {
        if (!window.confirm(`Hapus produk "${product.name}"?`)) {
            return;
        }

        router.delete(destroy.url(product.id), {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Products" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Products
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola daftar produk bakery dan persediaannya.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href={create()}>Tambah Produk</Link>
                    </Button>
                </div>

                <Card className="overflow-hidden border-sidebar-border/70 py-0 dark:border-sidebar-border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground dark:border-sidebar-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Nama</th>
                                    <th className="px-6 py-4 font-medium">Kategori</th>
                                    <th className="px-6 py-4 font-medium">SKU</th>
                                    <th className="px-6 py-4 text-right font-medium">Harga</th>
                                    <th className="px-6 py-4 text-right font-medium">Stok Min</th>
                                    <th className="px-6 py-4 text-right font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                {products.data.length === 0 ? (
                                    <tr>
                                        <td
                                            className="px-6 py-12 text-center text-muted-foreground"
                                            colSpan={6}
                                        >
                                            Belum ada produk.
                                        </td>
                                    </tr>
                                ) : (
                                    products.data.map((product) => (
                                        <tr
                                            className="transition-colors hover:bg-muted/30"
                                            key={product.id}
                                        >
                                            <td className="px-6 py-4 font-medium">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="secondary">
                                                    {product.category.name}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                                                {product.sku}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {currencyFormatter.format(
                                                    Number(product.price),
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {product.stock_min} {product.unit}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Button asChild size="sm" variant="outline">
                                                        <Link href={edit(product.id)}>
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDelete(product)}
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

                {products.last_page > 1 && (
                    <nav
                        aria-label="Pagination products"
                        className="flex flex-wrap justify-end gap-2"
                    >
                        {products.links.map((link, linkIndex) =>
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

ProductsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Products',
            href: index(),
        },
    ],
};