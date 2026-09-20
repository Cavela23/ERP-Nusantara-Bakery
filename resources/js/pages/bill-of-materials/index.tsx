import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { create, destroy, edit } from '@/routes/bill-of-materials';

type ProductRecipe = {
    id: number;
    name: string;
    sku: string;
    items_count: number;
};

type BillOfMaterialsIndexProps = {
    products: ProductRecipe[];
};

export default function BillOfMaterialsIndex({
    products,
}: BillOfMaterialsIndexProps) {
    function handleDelete(product: ProductRecipe) {
        if (!window.confirm(`Hapus resep untuk produk "${product.name}"?`)) {
            return;
        }

        router.delete(destroy.url(product.id), { preserveScroll: true });
    }

    return (
        <>
            <Head title="Resep Produk" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Resep Produk
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola komposisi bahan baku untuk setiap produk.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create()}>Buat Resep</Link>
                    </Button>
                </div>

                <Card className="overflow-hidden border-sidebar-border/70 py-0 dark:border-sidebar-border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase dark:border-sidebar-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium">
                                        Nama Produk
                                    </th>
                                    <th className="px-6 py-4 font-medium">
                                        SKU
                                    </th>
                                    <th className="px-6 py-4 font-medium">
                                        Jumlah Bahan Baku
                                    </th>
                                    <th className="px-6 py-4 text-right font-medium">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                {products.length === 0 ? (
                                    <tr>
                                        <td
                                            className="px-6 py-12 text-center text-muted-foreground"
                                            colSpan={4}
                                        >
                                            Belum ada resep produk.
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr
                                            className="transition-colors hover:bg-muted/30"
                                            key={product.id}
                                        >
                                            <td className="px-6 py-4 font-medium">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {product.sku}
                                            </td>
                                            <td className="px-6 py-4">
                                                {product.items_count}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    {product.items_count ===
                                                    0 ? (
                                                        <Button
                                                            asChild
                                                            size="sm"
                                                        >
                                                            <Link
                                                                href={create()}
                                                            >
                                                                Buat Resep
                                                            </Link>
                                                        </Button>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                asChild
                                                                size="sm"
                                                                variant="outline"
                                                            >
                                                                <Link
                                                                    href={edit(
                                                                        product.id,
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
                                                                        product,
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
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </>
    );
}

BillOfMaterialsIndex.layout = {
    breadcrumbs: [{ title: 'Resep Produk', href: '/bill-of-materials' }],
};
