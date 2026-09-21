import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index, store } from '@/routes/production-orders';

const quantityFormatter = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
});

type BomPreviewItem = {
    raw_material_name: string;
    raw_material_unit: string;
    quantity_needed: number;
    current_stock: number;
};

type ProductOption = {
    id: number;
    name: string;
    sku: string;
    unit: string;
    bill_of_materials: BomPreviewItem[];
};

type CreateProductionOrderProps = {
    products: ProductOption[];
};

export default function CreateProductionOrder({
    products,
}: CreateProductionOrderProps) {
    const [productId, setProductId] = useState<number | ''>('');
    const [quantity, setQuantity] = useState<string>('');
    const [productionDate, setProductionDate] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const form = useForm({
        product_id: '' as number | '',
        quantity: '',
        production_date: '',
        notes: '',
    });

    const selectedProduct = products.find((product) => product.id === productId);
    const quantityNum = Number(quantity) || 0;

    function errorFor(field: string) {
        return (form.errors as Record<string, string | undefined>)[field];
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.transform(() => ({
            product_id: productId,
            quantity,
            production_date: productionDate,
            notes,
        }));
        form.post(store.url(), { preserveScroll: true });
    }

    return (
        <>
            <Head title="Buat Produksi" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Buat Produksi
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Catat produksi dan periksa kecukupan bahan baku sebelum disimpan.
                    </p>
                </div>

                <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                    <CardContent className="pt-6">
                        <form className="space-y-8" onSubmit={submit}>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="grid gap-2 md:col-span-2">
                                    <Label htmlFor="product_id">Produk</Label>
                                    <select
                                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        id="product_id"
                                        value={productId}
                                        onChange={(event) =>
                                            setProductId(
                                                event.target.value
                                                    ? Number(event.target.value)
                                                    : '',
                                            )
                                        }
                                        required
                                    >
                                        <option value="" disabled>
                                            Pilih produk
                                        </option>
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name} ({product.sku})
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errorFor('product_id')} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="quantity">
                                        Jumlah Produksi
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="quantity"
                                            min="0.001"
                                            step="0.001"
                                            type="number"
                                            value={quantity}
                                            onChange={(event) =>
                                                setQuantity(event.target.value)
                                            }
                                            placeholder="Contoh: 100"
                                            required
                                        />
                                        <span className="min-w-12 text-sm text-muted-foreground">
                                            {selectedProduct?.unit ?? 'unit'}
                                        </span>
                                    </div>
                                    <InputError message={errorFor('quantity')} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="production_date">
                                        Tanggal Produksi
                                    </Label>
                                    <Input
                                        id="production_date"
                                        type="date"
                                        value={productionDate}
                                        onChange={(event) =>
                                            setProductionDate(event.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errorFor('production_date')}
                                    />
                                </div>

                                <div className="grid gap-2 md:col-span-2">
                                    <Label htmlFor="notes">Catatan</Label>
                                    <textarea
                                        className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        id="notes"
                                        value={notes}
                                        onChange={(event) =>
                                            setNotes(event.target.value)
                                        }
                                        placeholder="Catatan produksi (opsional)"
                                    />
                                    <InputError message={errorFor('notes')} />
                                </div>
                            </div>

                            {selectedProduct && (
                                <div className="space-y-4">
                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            Preview Kebutuhan Bahan
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            Perkiraan bahan baku untuk {quantityFormatter.format(quantityNum)}{' '}
                                            {selectedProduct.unit} {selectedProduct.name}.
                                        </p>
                                    </div>

                                    <div className="overflow-x-auto rounded-md border border-sidebar-border/70 dark:border-sidebar-border">
                                        <table className="w-full min-w-[680px] text-left text-sm">
                                            <thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase dark:border-sidebar-border">
                                                <tr>
                                                    <th className="px-4 py-3 font-medium">
                                                        Bahan Baku
                                                    </th>
                                                    <th className="px-4 py-3 font-medium">
                                                        Dibutuhkan
                                                    </th>
                                                    <th className="px-4 py-3 font-medium">
                                                        Stok Saat Ini
                                                    </th>
                                                    <th className="px-4 py-3 font-medium">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                                {selectedProduct.bill_of_materials.map(
                                                    (item, itemIndex) => {
                                                        const needed =
                                                            item.quantity_needed *
                                                            quantityNum;
                                                        const isEnough =
                                                            item.current_stock >= needed;

                                                        return (
                                                            <tr
                                                                key={`${item.raw_material_name}-${itemIndex}`}
                                                            >
                                                                <td className="px-4 py-3 font-medium">
                                                                    {item.raw_material_name}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    {quantityFormatter.format(needed)}{' '}
                                                                    {item.raw_material_unit}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    {quantityFormatter.format(
                                                                        Number(item.current_stock),
                                                                    )}{' '}
                                                                    {item.raw_material_unit}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <Badge
                                                                        variant={
                                                                            isEnough
                                                                                ? 'outline'
                                                                                : 'destructive'
                                                                        }
                                                                        className={
                                                                            isEnough
                                                                                ? 'border-green-600 text-green-600'
                                                                                : ''
                                                                        }
                                                                    >
                                                                        {isEnough
                                                                            ? 'Cukup'
                                                                            : 'Kurang'}
                                                                    </Badge>
                                                                </td>
                                                            </tr>
                                                        );
                                                    },
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3">
                                <Button asChild variant="outline">
                                    <Link href={index()}>Batal</Link>
                                </Button>
                                <Button disabled={form.processing} type="submit">
                                    {form.processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Produksi'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CreateProductionOrder.layout = {
    breadcrumbs: [
        { title: 'Production Orders', href: index() },
        { title: 'Buat Produksi', href: '#' },
    ],
};
