import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index, store, update } from '@/routes/bill-of-materials';

export type ProductOption = {
    id: number;
    name: string;
    sku: string;
};

export type RawMaterialOption = {
    id: number;
    name: string;
    sku: string;
    unit: string;
};

export type BillOfMaterialItem = {
    id?: number;
    raw_material_id: number | '';
    quantity_needed: string | number;
    rawMaterial?: RawMaterialOption;
};

type BillOfMaterialFormProps = {
    products: ProductOption[];
    rawMaterials: RawMaterialOption[];
    product?: ProductOption;
    items?: BillOfMaterialItem[];
};

const emptyItem = (): BillOfMaterialItem => ({
    raw_material_id: '',
    quantity_needed: '',
});

export default function BillOfMaterialForm({
    products,
    rawMaterials,
    product,
    items: existingItems,
}: BillOfMaterialFormProps) {
    const isEditing = Boolean(product);
    const [productId, setProductId] = useState<number | ''>(product?.id ?? '');
    const [items, setItems] = useState<BillOfMaterialItem[]>(
        existingItems?.length
            ? existingItems.map((item) => ({
                  id: item.id,
                  raw_material_id: item.raw_material_id,
                  quantity_needed: item.quantity_needed,
              }))
            : [emptyItem()],
    );
    const form = useForm({
        product_id: product?.id ?? '',
        items,
    });

    function addItem() {
        setItems((current) => [...current, emptyItem()]);
    }

    function removeItem(indexToRemove: number) {
        setItems((current) =>
            current.length === 1
                ? [emptyItem()]
                : current.filter((_, index) => index !== indexToRemove),
        );
    }

    function updateItem(
        itemIndex: number,
        field: keyof Pick<
            BillOfMaterialItem,
            'raw_material_id' | 'quantity_needed'
        >,
        value: string,
    ) {
        setItems((current) =>
            current.map((item, index) => {
                if (index !== itemIndex) {
                    return item;
                }

                return {
                    ...item,
                    [field]:
                        field === 'raw_material_id'
                            ? value === ''
                                ? ''
                                : Number(value)
                            : value,
                };
            }),
        );
    }

    function errorFor(field: string) {
        return (form.errors as Record<string, string | undefined>)[field];
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const payload = {
            product_id: productId,
            items: items.map(({ raw_material_id, quantity_needed }) => ({
                raw_material_id,
                quantity_needed,
            })),
        };

        form.transform(() => payload);

        if (isEditing && product) {
            form.put(update.url(product.id), { preserveScroll: true });
        } else {
            form.post(store.url(), { preserveScroll: true });
        }
    }

    return (
        <>
            <Head
                title={isEditing ? `Edit Resep ${product?.name}` : 'Buat Resep'}
            />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {isEditing ? 'Edit Resep' : 'Buat Resep'}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Tentukan kebutuhan bahan baku untuk satu unit produk.
                    </p>
                </div>

                <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                    <CardContent className="pt-6">
                        <form className="space-y-8" onSubmit={submit}>
                            <div className="grid gap-2">
                                <Label htmlFor="product_id">Produk</Label>
                                {isEditing ? (
                                    <div className="rounded-md border border-input bg-muted/40 px-3 py-2 text-sm">
                                        {product?.name} ({product?.sku})
                                    </div>
                                ) : (
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
                                        {products.map((option) => (
                                            <option
                                                key={option.id}
                                                value={option.id}
                                            >
                                                {option.name} ({option.sku})
                                            </option>
                                        ))}
                                    </select>
                                )}
                                <InputError message={errorFor('product_id')} />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <h2 className="text-lg font-semibold">
                                        Bahan Baku
                                    </h2>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addItem}
                                    >
                                        + Tambah Bahan
                                    </Button>
                                </div>

                                <div className="overflow-x-auto rounded-md border border-sidebar-border/70 dark:border-sidebar-border">
                                    <table className="w-full min-w-[700px] text-left text-sm">
                                        <thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase dark:border-sidebar-border">
                                            <tr>
                                                <th className="px-4 py-3 font-medium">
                                                    Bahan Baku
                                                </th>
                                                <th className="px-4 py-3 font-medium">
                                                    Kebutuhan per Unit
                                                </th>
                                                <th className="px-4 py-3 text-right font-medium">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                            {items.map((item, itemIndex) => (
                                                <tr key={item.id ?? itemIndex}>
                                                    <td className="px-4 py-3 align-top">
                                                        <select
                                                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                                            value={
                                                                item.raw_material_id
                                                            }
                                                            onChange={(event) =>
                                                                updateItem(
                                                                    itemIndex,
                                                                    'raw_material_id',
                                                                    event.target
                                                                        .value,
                                                                )
                                                            }
                                                            required
                                                        >
                                                            <option
                                                                value=""
                                                                disabled
                                                            >
                                                                Pilih bahan baku
                                                            </option>
                                                            {rawMaterials.map(
                                                                (
                                                                    rawMaterial,
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            rawMaterial.id
                                                                        }
                                                                        value={
                                                                            rawMaterial.id
                                                                        }
                                                                    >
                                                                        {
                                                                            rawMaterial.name
                                                                        }{' '}
                                                                        (
                                                                        {
                                                                            rawMaterial.sku
                                                                        }
                                                                        )
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                        <InputError
                                                            message={errorFor(
                                                                `items.${itemIndex}.raw_material_id`,
                                                            )}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 align-top">
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                min="0.001"
                                                                step="0.001"
                                                                type="number"
                                                                value={
                                                                    item.quantity_needed
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    updateItem(
                                                                        itemIndex,
                                                                        'quantity_needed',
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                                required
                                                            />
                                                            <span className="text-sm whitespace-nowrap text-muted-foreground">
                                                                {rawMaterials.find(
                                                                    (
                                                                        rawMaterial,
                                                                    ) =>
                                                                        rawMaterial.id ===
                                                                        item.raw_material_id,
                                                                )?.unit ?? ''}
                                                            </span>
                                                        </div>
                                                        <InputError
                                                            message={errorFor(
                                                                `items.${itemIndex}.quantity_needed`,
                                                            )}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-right align-top">
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                removeItem(
                                                                    itemIndex,
                                                                )
                                                            }
                                                        >
                                                            Hapus
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <InputError message={errorFor('items')} />
                            </div>

                            <div className="flex justify-end gap-3 border-t border-sidebar-border/70 pt-6 dark:border-sidebar-border">
                                <Button asChild variant="outline">
                                    <Link href={index()}>Batal</Link>
                                </Button>
                                <Button
                                    disabled={form.processing}
                                    type="submit"
                                >
                                    {form.processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Resep'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
