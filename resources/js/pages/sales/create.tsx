import { Head, useForm } from '@inertiajs/react';
import { Minus, Plus, Search, ShoppingBag } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index, store } from '@/routes/sales';

type BranchOption = {
    id: number;
    name: string;
};

type CategoryOption = {
    id: number;
    name: string;
};

type ProductOption = {
    id: number;
    name: string;
    sku: string;
    price: string | number;
    unit: string;
    category_id: number | null;
    stock_by_branch: Record<number, number>;
};

type SaleItemPayload = {
    product_id: number;
    quantity: number;
    unit_price: number;
};

type CreateSaleProps = {
    branches: BranchOption[];
    categories: CategoryOption[];
    products: ProductOption[];
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 2,
    }).format(value);

const formatQuantity = (value: number) =>
    new Intl.NumberFormat('id-ID', { maximumFractionDigits: 3 }).format(value);

const todayString = () => {
    const today = new Date();

    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

export default function CreateSale({
    branches,
    categories,
    products,
}: CreateSaleProps) {
    const [branchId, setBranchId] = useState<number | ''>('');
    const [saleDate, setSaleDate] = useState(todayString);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState<'all' | number>('all');
    const [cart, setCart] = useState<Record<number, number>>({});
    const form = useForm({
        branch_id: '' as number | '',
        sale_date: todayString(),
        items: [] as SaleItemPayload[],
    });

    const filteredProducts = useMemo(() => {
        const normalizedSearch = search.trim().toLocaleLowerCase();

        return products.filter((product) => {
            const matchesCategory =
                activeCategory === 'all' ||
                product.category_id === activeCategory;
            const matchesSearch =
                !normalizedSearch ||
                product.name.toLocaleLowerCase().includes(normalizedSearch) ||
                product.sku.toLocaleLowerCase().includes(normalizedSearch);

            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, products, search]);

    const cartItems = useMemo(
        () =>
            products.flatMap((product) => {
                const quantity = cart[product.id] ?? 0;

                return quantity > 0 ? [{ product, quantity }] : [];
            }),
        [cart, products],
    );
    const total = cartItems.reduce(
        (sum, item) => sum + item.quantity * Number(item.product.price),
        0,
    );
    const errors = form.errors as Record<string, string | undefined>;

    function updateQuantity(productId: number, quantity: number) {
        setCart((current) => {
            const next = { ...current };

            if (quantity <= 0) {
                delete next[productId];
            } else {
                next[productId] = quantity;
            }

            return next;
        });
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.transform(() => ({
            branch_id: branchId,
            sale_date: saleDate,
            items: cartItems.map(({ product, quantity }) => ({
                product_id: product.id,
                quantity,
                unit_price: Number(product.price),
            })),
        }));
        form.post(store.url(), { preserveScroll: true });
    }

    return (
        <>
            <Head title="Buat Transaksi Penjualan" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Buat Transaksi
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Pilih produk dan susun keranjang untuk mencatat
                        penjualan.
                    </p>
                </div>

                <form
                    className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
                    onSubmit={submit}
                >
                    <section className="min-w-0 space-y-6">
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="grid gap-2">
                                <Label htmlFor="branch_id">Cabang</Label>
                                <select
                                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                    id="branch_id"
                                    value={branchId}
                                    onChange={(event) => {
                                        setBranchId(
                                            event.target.value
                                                ? Number(event.target.value)
                                                : '',
                                        );
                                        setCart({});
                                    }}
                                    required
                                >
                                    <option value="" disabled>
                                        Pilih cabang
                                    </option>
                                    {branches.map((branch) => (
                                        <option
                                            key={branch.id}
                                            value={branch.id}
                                        >
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.branch_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="sale_date">Tanggal</Label>
                                <Input
                                    id="sale_date"
                                    type="date"
                                    value={saleDate}
                                    onChange={(event) =>
                                        setSaleDate(event.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.sale_date} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="product-search">
                                    Cari produk
                                </Label>
                                <div className="relative">
                                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        className="pl-9"
                                        id="product-search"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Nama atau SKU"
                                    />
                                </div>
                            </div>
                        </div>

                        <div
                            aria-label="Filter kategori produk"
                            className="flex gap-2 overflow-x-auto pb-1"
                        >
                            <Button
                                aria-pressed={activeCategory === 'all'}
                                className="shrink-0"
                                onClick={() => setActiveCategory('all')}
                                type="button"
                                variant={
                                    activeCategory === 'all'
                                        ? 'default'
                                        : 'outline'
                                }
                            >
                                All Menu{' '}
                                <span className="opacity-75">
                                    ({products.length})
                                </span>
                            </Button>
                            {categories.map((category) => {
                                const count = products.filter(
                                    (product) =>
                                        product.category_id === category.id,
                                ).length;
                                const isActive = activeCategory === category.id;

                                return (
                                    <Button
                                        aria-pressed={isActive}
                                        className="shrink-0"
                                        key={category.id}
                                        onClick={() =>
                                            setActiveCategory(category.id)
                                        }
                                        type="button"
                                        variant={
                                            isActive ? 'default' : 'outline'
                                        }
                                    >
                                        {category.name}{' '}
                                        <span className="opacity-75">
                                            ({count})
                                        </span>
                                    </Button>
                                );
                            })}
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
                                Tidak ada produk yang cocok dengan pencarian.
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {filteredProducts.map((product) => {
                                    const stock =
                                        branchId === ''
                                            ? 0
                                            : Number(
                                                  product.stock_by_branch[
                                                      branchId
                                                  ] ?? 0,
                                              );
                                    const quantity = cart[product.id] ?? 0;
                                    const stepperDisabled =
                                        stock <= 0 || branchId === '';
                                    const initials =
                                        product.name
                                            .trim()
                                            .split(/\s+/)
                                            .slice(0, 2)
                                            .map((word) => word[0])
                                            .join('')
                                            .toUpperCase() || '?';

                                    return (
                                        <Card
                                            className="overflow-hidden border-sidebar-border/70 py-0 dark:border-sidebar-border"
                                            key={product.id}
                                        >
                                            <CardContent className="flex h-full flex-col gap-4 p-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted text-lg font-semibold text-muted-foreground">
                                                        {initials}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h2 className="line-clamp-2 font-medium">
                                                            {product.name}
                                                        </h2>
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {product.sku}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="font-semibold">
                                                        {formatCurrency(
                                                            Number(
                                                                product.price,
                                                            ),
                                                        )}
                                                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                                                            / {product.unit}
                                                        </span>
                                                    </p>
                                                    <Badge
                                                        className={
                                                            stock > 0
                                                                ? 'border-transparent bg-emerald-100 text-emerald-800'
                                                                : ''
                                                        }
                                                        variant={
                                                            stock > 0
                                                                ? 'outline'
                                                                : 'destructive'
                                                        }
                                                    >
                                                        {branchId === ''
                                                            ? 'Pilih cabang'
                                                            : stock > 0
                                                              ? `Tersedia · ${formatQuantity(stock)}`
                                                              : 'Stok Habis'}
                                                    </Badge>
                                                </div>

                                                <div className="mt-auto flex items-center justify-between border-t pt-3">
                                                    <span className="text-sm text-muted-foreground">
                                                        Jumlah
                                                    </span>
                                                    <div className="flex items-center gap-3">
                                                        <Button
                                                            aria-label={`Kurangi ${product.name}`}
                                                            disabled={
                                                                stepperDisabled ||
                                                                quantity <= 0
                                                            }
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    product.id,
                                                                    quantity -
                                                                        1,
                                                                )
                                                            }
                                                            size="icon"
                                                            type="button"
                                                            variant="outline"
                                                        >
                                                            <Minus />
                                                        </Button>
                                                        <span className="min-w-6 text-center text-sm font-medium">
                                                            {formatQuantity(
                                                                quantity,
                                                            )}
                                                        </span>
                                                        <Button
                                                            aria-label={`Tambah ${product.name}`}
                                                            disabled={
                                                                stepperDisabled ||
                                                                quantity >=
                                                                    stock
                                                            }
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    product.id,
                                                                    Math.min(
                                                                        quantity +
                                                                            1,
                                                                        stock,
                                                                    ),
                                                                )
                                                            }
                                                            size="icon"
                                                            type="button"
                                                            variant="outline"
                                                        >
                                                            <Plus />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    <Card className="border-sidebar-border/70 py-0 lg:sticky lg:top-4 dark:border-sidebar-border">
                        <CardHeader className="border-b py-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ShoppingBag className="size-5" />
                                Ringkasan Keranjang
                                <Badge className="ml-auto" variant="secondary">
                                    {cartItems.length} item
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-4">
                            {cartItems.length === 0 ? (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    Keranjang masih kosong. Tambahkan produk
                                    untuk memulai transaksi.
                                </p>
                            ) : (
                                <div className="max-h-[45vh] space-y-4 overflow-y-auto">
                                    {cartItems.map(({ product, quantity }) => (
                                        <div
                                            className="flex items-start justify-between gap-3"
                                            key={product.id}
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">
                                                    {product.name}
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {formatQuantity(quantity)} ×{' '}
                                                    {formatCurrency(
                                                        Number(product.price),
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2">
                                                <span className="text-sm font-medium">
                                                    {formatCurrency(
                                                        quantity *
                                                            Number(
                                                                product.price,
                                                            ),
                                                    )}
                                                </span>
                                                <Button
                                                    aria-label={`Kurangi ${product.name}`}
                                                    onClick={() =>
                                                        updateQuantity(
                                                            product.id,
                                                            quantity - 1,
                                                        )
                                                    }
                                                    size="icon"
                                                    type="button"
                                                    variant="ghost"
                                                >
                                                    <Minus />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {errors.stock && (
                                <p
                                    className="text-sm text-destructive"
                                    role="alert"
                                >
                                    {errors.stock}
                                </p>
                            )}
                            {errors.items && (
                                <p
                                    className="text-sm text-destructive"
                                    role="alert"
                                >
                                    {errors.items}
                                </p>
                            )}

                            <div className="space-y-3 border-t pt-4">
                                <div className="flex items-center justify-between font-semibold">
                                    <span>Total</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                                <Button
                                    className="w-full"
                                    disabled={
                                        !branchId ||
                                        cartItems.length === 0 ||
                                        form.processing
                                    }
                                    type="submit"
                                >
                                    Simpan Transaksi
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </>
    );
}

CreateSale.layout = {
    breadcrumbs: [
        { title: 'Riwayat Penjualan', href: index() },
        { title: 'Buat Transaksi', href: '#' },
    ],
};
