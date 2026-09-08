import { Form, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index } from '@/routes/products';

export type Category = {
    id: number;
    name: string;
};

export type ProductFormData = {
    id?: number;
    name?: string;
    category_id?: number;
    sku?: string;
    price?: string | number;
    unit?: string;
    stock_min?: string | number;
};

type ProductFormProps = {
    title: string;
    description: string;
    categories: Category[];
    product?: ProductFormData;
    form: {
        action: string;
        method: 'post';
    };
    children?: ReactNode;
};

export default function ProductForm({
    title,
    description,
    categories,
    product,
    form,
}: ProductFormProps) {
    return (
        <>
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                <CardContent className="pt-6">
                    <Form
                        {...form}
                        options={{ preserveScroll: true }}
                        className="space-y-6"
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="grid gap-2 md:col-span-2">
                                        <Label htmlFor="name">Nama Produk</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={product?.name ?? ''}
                                            placeholder="Contoh: Roti Cokelat"
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="category_id">Kategori</Label>
                                        <select
                                            className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                            defaultValue={product?.category_id ?? ''}
                                            id="category_id"
                                            name="category_id"
                                            required
                                        >
                                            <option value="" disabled>
                                                Pilih kategori
                                            </option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.category_id} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="sku">SKU</Label>
                                        <Input
                                            id="sku"
                                            name="sku"
                                            defaultValue={product?.sku ?? ''}
                                            placeholder="Contoh: SKU-001"
                                            required
                                        />
                                        <InputError message={errors.sku} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="price">Harga</Label>
                                        <Input
                                            id="price"
                                            min="0"
                                            name="price"
                                            defaultValue={product?.price ?? ''}
                                            step="0.01"
                                            type="number"
                                            required
                                        />
                                        <InputError message={errors.price} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="unit">Satuan</Label>
                                        <Input
                                            id="unit"
                                            name="unit"
                                            defaultValue={product?.unit ?? 'pcs'}
                                            placeholder="pcs, kg, box"
                                            required
                                        />
                                        <InputError message={errors.unit} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="stock_min">Stok Minimum</Label>
                                        <Input
                                            id="stock_min"
                                            min="0"
                                            name="stock_min"
                                            defaultValue={product?.stock_min ?? ''}
                                            step="0.001"
                                            type="number"
                                            required
                                        />
                                        <InputError message={errors.stock_min} />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Button asChild variant="outline">
                                        <Link href={index()}>Batal</Link>
                                    </Button>
                                    <Button disabled={processing} type="submit">
                                        {processing ? 'Menyimpan...' : 'Simpan Produk'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </CardContent>
            </Card>
        </>
    );
}