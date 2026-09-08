import { useState, type FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index, store, update } from '@/routes/purchasing';

export type Supplier = {
    id: number;
    name: string;
};

export type RawMaterialOption = {
    id: number;
    name: string;
    sku: string;
    price: string | number;
    unit: string;
};

export type ItemRow = {
    raw_material_id: number | '';
    quantity: number | '';
    unit_price: number | '';
};

type PurchaseOrderItem = ItemRow & {
    id?: number;
    subtotal?: string | number;
};

export type PurchaseOrderFormData = {
    id: number;
    po_number?: string;
    supplier_id: number;
    order_date: string;
    expected_date: string | null;
    notes: string | null;
    items: PurchaseOrderItem[];
};

type PurchaseOrderFormProps = {
    suppliers: Supplier[];
    rawMaterials: RawMaterialOption[];
    purchaseOrder?: PurchaseOrderFormData;
};

type HeaderState = {
    supplier_id: number | '';
    order_date: string;
    expected_date: string;
    notes: string;
};

const emptyItem = (): ItemRow => ({
    raw_material_id: '',
    quantity: '',
    unit_price: '',
});

const formatNumber = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 2,
    }).format(value);

export default function PurchaseOrderForm({
    suppliers,
    rawMaterials,
    purchaseOrder,
}: PurchaseOrderFormProps) {
    const isEditing = Boolean(purchaseOrder);
    const [header, setHeader] = useState<HeaderState>({
        supplier_id: purchaseOrder?.supplier_id ?? '',
        order_date: purchaseOrder?.order_date?.slice(0, 10) ?? '',
        expected_date: purchaseOrder?.expected_date?.slice(0, 10) ?? '',
        notes: purchaseOrder?.notes ?? '',
    });
    const [items, setItems] = useState<ItemRow[]>(
        purchaseOrder?.items.length
            ? purchaseOrder.items.map((item) => ({
                  raw_material_id: item.raw_material_id,
                  quantity: item.quantity,
                  unit_price: item.unit_price,
              }))
            : [emptyItem()],
    );
    const form = useForm({
        supplier_id: '',
        order_date: '',
        expected_date: '',
        notes: '',
        items: [emptyItem()],
    });

    const subtotals = items.map((item) =>
        Number(item.quantity || 0) * Number(item.unit_price || 0),
    );
    const totalAmount = subtotals.reduce((total, subtotal) => total + subtotal, 0);
    const hasInvalidItems = items.some(
        (item) => !item.raw_material_id || Number(item.quantity) <= 0,
    );
    const isInvalidHeader = !header.supplier_id || !header.order_date;

    function updateHeader(field: keyof HeaderState, value: string) {
        setHeader((current) => ({
            ...current,
            [field]: field === 'supplier_id' ? (value ? Number(value) : '') : value,
        }));
    }

    function addItemRow() {
        setItems((current) => [...current, emptyItem()]);
    }

    function removeItemRow(indexToRemove: number) {
        setItems((current) =>
            current.length === 1
                ? [emptyItem()]
                : current.filter((_, index) => index !== indexToRemove),
        );
    }

    function updateItemRow(
        rowIndex: number,
        field: keyof ItemRow,
        value: string,
    ) {
        setItems((current) =>
            current.map((item, index) => {
                if (index !== rowIndex) {
                    return item;
                }

                const parsedValue =
                    field === 'raw_material_id' || field === 'quantity' || field === 'unit_price'
                        ? value === ''
                            ? ''
                            : Number(value)
                        : value;

                if (field !== 'raw_material_id') {
                    return { ...item, [field]: parsedValue };
                }

                const selectedRawMaterial = rawMaterials.find(
                    (rawMaterial) => rawMaterial.id === Number(parsedValue),
                );

                return {
                    ...item,
                    raw_material_id: parsedValue as number | '',
                    unit_price: selectedRawMaterial
                        ? Number(selectedRawMaterial.price)
                        : '',
                };
            }),
        );
    }

    function errorFor(field: string) {
        return (form.errors as Record<string, string | undefined>)[field];
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.transform(() => ({
            ...header,
            items,
        }));

        if (isEditing && purchaseOrder) {
            form.put(update.url(purchaseOrder.id), {
                preserveScroll: true,
            });
        } else {
            form.post(store.url(), {
                preserveScroll: true,
            });
        }
    }

    return (
        <>
            <Head title={isEditing ? 'Edit Purchase Order' : 'Buat Purchase Order'} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {isEditing ? 'Edit Purchase Order' : 'Buat Purchase Order'}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola informasi PO dan item yang dipesan.
                    </p>
                </div>

                <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                    <CardContent className="pt-6">
                        <form className="space-y-8" onSubmit={submit}>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="supplier_id">Supplier</Label>
                                    <select
                                        className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                        id="supplier_id"
                                        value={header.supplier_id}
                                        onChange={(event) =>
                                            updateHeader('supplier_id', event.target.value)
                                        }
                                        required
                                    >
                                        <option value="" disabled>
                                            Pilih supplier
                                        </option>
                                        {suppliers.map((supplier) => (
                                            <option key={supplier.id} value={supplier.id}>
                                                {supplier.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errorFor('supplier_id')} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="order_date">Order Date</Label>
                                    <Input
                                        id="order_date"
                                        type="date"
                                        value={header.order_date}
                                        onChange={(event) =>
                                            updateHeader('order_date', event.target.value)
                                        }
                                        required
                                    />
                                    <InputError message={errorFor('order_date')} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="expected_date">Expected Date</Label>
                                    <Input
                                        id="expected_date"
                                        type="date"
                                        value={header.expected_date}
                                        onChange={(event) =>
                                            updateHeader('expected_date', event.target.value)
                                        }
                                    />
                                    <InputError message={errorFor('expected_date')} />
                                </div>

                                <div className="grid gap-2 md:col-span-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <textarea
                                        className="border-input bg-background min-h-24 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                        id="notes"
                                        value={header.notes}
                                        onChange={(event) =>
                                            updateHeader('notes', event.target.value)
                                        }
                                        placeholder="Catatan tambahan untuk PO"
                                    />
                                    <InputError message={errorFor('notes')} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <h2 className="text-lg font-semibold">Item Pesanan</h2>
                                    <Button type="button" variant="outline" onClick={addItemRow}>
                                        + Tambah Item
                                    </Button>
                                </div>

                                <div className="overflow-x-auto rounded-md border border-sidebar-border/70 dark:border-sidebar-border">
                                    <table className="w-full min-w-[760px] text-left text-sm">
                                        <thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground dark:border-sidebar-border">
                                            <tr>
                                                <th className="px-4 py-3 font-medium">Bahan Baku</th>
                                                <th className="px-4 py-3 font-medium">Qty</th>
                                                <th className="px-4 py-3 font-medium">Harga Satuan</th>
                                                <th className="px-4 py-3 text-right font-medium">Subtotal</th>
                                                <th className="px-4 py-3 text-right font-medium">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                            {items.map((item, itemIndex) => {
                                                const selectedMaterial = rawMaterials.find(
                                                    (rawMaterial) =>
                                                        rawMaterial.id === item.raw_material_id,
                                                );

                                                return (    
                                                    <tr key={itemIndex}>
                                                    <td className="px-4 py-3 align-top">
                                                        <select
                                                            className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                                            value={item.raw_material_id}
                                                            onChange={(event) =>
                                                                updateItemRow(
                                                                    itemIndex,
                                                                    'raw_material_id',
                                                                    event.target.value,
                                                                )
                                                            }
                                                            required
                                                        >
                                                            <option value="" disabled>
                                                                Pilih bahan baku
                                                            </option>
                                                            {rawMaterials.map((rawMaterial) => (
                                                                <option key={rawMaterial.id} value={rawMaterial.id}>
                                                                    {rawMaterial.name} ({rawMaterial.sku})
                                                                </option>
                                                            ))}
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
                                                                value={item.quantity}
                                                                onChange={(event) =>
                                                                    updateItemRow(
                                                                        itemIndex,
                                                                        'quantity',
                                                                        event.target.value,
                                                                    )
                                                                }
                                                                required
                                                            />
                                                            <span className="whitespace-nowrap text-sm text-muted-foreground">
                                                                {selectedMaterial?.unit ?? ''}
                                                            </span>
                                                        </div>
                                                        <InputError
                                                            message={errorFor(
                                                                `items.${itemIndex}.quantity`,
                                                            )}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 align-top">
                                                        <Input
                                                            min="0"
                                                            step="0.01"
                                                            type="number"
                                                            value={item.unit_price}
                                                            onChange={(event) =>
                                                                updateItemRow(
                                                                    itemIndex,
                                                                    'unit_price',
                                                                    event.target.value,
                                                                )
                                                            }
                                                            required
                                                        />
                                                        <InputError
                                                            message={errorFor(
                                                                `items.${itemIndex}.unit_price`,
                                                            )}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-right align-top font-medium">
                                                        {formatNumber(subtotals[itemIndex])}
                                                    </td>
                                                    <td className="px-4 py-3 text-right align-top">
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => removeItemRow(itemIndex)}
                                                        >
                                                            Hapus
                                                        </Button>
                                                    </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <InputError message={errorFor('items')} />
                            </div>

                            <div className="flex flex-col items-end gap-4 border-t border-sidebar-border/70 pt-6 dark:border-sidebar-border">
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Total</p>
                                    <p className="text-2xl font-semibold">{formatNumber(totalAmount)}</p>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button asChild variant="outline">
                                        <Link href={index()}>Batal</Link>
                                    </Button>
                                    <Button
                                        disabled={
                                            form.processing ||
                                            hasInvalidItems ||
                                            isInvalidHeader
                                        }
                                        type="submit"
                                    >
                                        {form.processing ? 'Menyimpan...' : 'Simpan PO'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
