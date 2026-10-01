import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index, store } from '@/routes/sales';

export type BranchOption = {
	id: number;
	name: string;
};

export type ProductOption = {
	id: number;
	name: string;
	sku: string;
	price: string | number;
	unit: string;
	stock_by_branch: Record<number, number>;
};

type ItemRow = {
	product_id: number | '';
	quantity: number | '';
	unit_price: number | '';
};

type SaleFormProps = {
	branches: BranchOption[];
	products: ProductOption[];
};

type HeaderState = {
	branch_id: number | '';
	sale_date: string;
};

const emptyItem = (): ItemRow => ({
	product_id: '',
	quantity: '',
	unit_price: '',
});

const today = new Date();
const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

const formatCurrency = (value: number) =>
	new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: 2,
	}).format(value);

const formatQuantity = (value: number) =>
	new Intl.NumberFormat('id-ID', { maximumFractionDigits: 3 }).format(value);

export default function SaleForm({ branches, products }: SaleFormProps) {
	const [header, setHeader] = useState<HeaderState>({
		branch_id: '',
		sale_date: todayString,
	});
	const [items, setItems] = useState<ItemRow[]>([emptyItem()]);
	const form = useForm({
		branch_id: '' as number | '',
		sale_date: todayString,
		items: [emptyItem()],
	});

	const subtotals = items.map(
		(item) => Number(item.quantity || 0) * Number(item.unit_price || 0),
	);
	const totalAmount = subtotals.reduce((total, subtotal) => total + subtotal, 0);
	const hasInsufficientStock =
		Boolean(header.branch_id) &&
		products.some((product) => {
			const requestedQuantity = items
				.filter((item) => item.product_id === product.id)
				.reduce((total, item) => total + Number(item.quantity || 0), 0);

			return (
				requestedQuantity >
				Number(product.stock_by_branch[header.branch_id as number] ?? 0)
			);
		});
	const hasInvalidItems = items.some(
		(item) =>
			!item.product_id ||
			Number(item.quantity) <= 0 ||
			item.unit_price === '' ||
			Number(item.unit_price) < 0,
	) || hasInsufficientStock;
	const hasInvalidHeader = !header.branch_id || !header.sale_date;

	function updateHeader(field: keyof HeaderState, value: string) {
		setHeader((current) => ({
			...current,
			[field]: field === 'branch_id' ? (value ? Number(value) : '') : value,
		}));
	}

	function addItemRow() {
		setItems((current) => [...current, emptyItem()]);
	}

	function removeItemRow(rowToRemove: number) {
		setItems((current) =>
			current.length === 1
				? [emptyItem()]
				: current.filter((_, rowIndex) => rowIndex !== rowToRemove),
		);
	}

	function updateItemRow(rowIndex: number, field: keyof ItemRow, value: string) {
		setItems((current) =>
			current.map((item, index) => {
				if (index !== rowIndex) {
					return item;
				}

				const parsedValue = value === '' ? '' : Number(value);

				if (field !== 'product_id') {
					return { ...item, [field]: parsedValue };
				}

				const selectedProduct = products.find(
					(product) => product.id === Number(parsedValue),
				);

				return {
					...item,
					product_id: parsedValue as number | '',
					unit_price: selectedProduct ? Number(selectedProduct.price) : '',
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
		form.post(store.url(), { preserveScroll: true });
	}

	return (
		<>
			<Head title="Buat Transaksi Penjualan" />

			<div className="flex h-full flex-1 flex-col gap-6 p-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">
						Buat Transaksi Penjualan
					</h1>
					<p className="text-sm text-muted-foreground">
						Catat penjualan produk pada cabang.
					</p>
				</div>

				<Card className="border-sidebar-border/70 dark:border-sidebar-border">
					<CardContent className="pt-6">
						<form className="space-y-8" onSubmit={submit}>
							<div className="grid gap-6 md:grid-cols-2">
								<div className="grid gap-2">
									<Label htmlFor="branch_id">Cabang</Label>
									<select
										className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
										id="branch_id"
										value={header.branch_id}
										onChange={(event) =>
											updateHeader('branch_id', event.target.value)
										}
										required
									>
										<option value="" disabled>
											Pilih cabang
										</option>
										{branches.map((branch) => (
											<option key={branch.id} value={branch.id}>
												{branch.name}
											</option>
										))}
									</select>
									<InputError message={errorFor('branch_id')} />
								</div>

								<div className="grid gap-2">
									<Label htmlFor="sale_date">Tanggal</Label>
									<Input
										id="sale_date"
										type="date"
										value={header.sale_date}
										onChange={(event) =>
											updateHeader('sale_date', event.target.value)
										}
										required
									/>
									<InputError message={errorFor('sale_date')} />
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-center justify-between gap-4">
									<h2 className="text-lg font-semibold">Item Penjualan</h2>
									<Button type="button" variant="outline" onClick={addItemRow}>
										+ Tambah Item
									</Button>
								</div>

								<div className="overflow-x-auto rounded-md border border-sidebar-border/70 dark:border-sidebar-border">
									<table className="w-full min-w-[800px] text-left text-sm">
										<thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground dark:border-sidebar-border">
											<tr>
												<th className="px-4 py-3 font-medium">Produk</th>
												<th className="px-4 py-3 font-medium">Qty</th>
												<th className="px-4 py-3 font-medium">Harga Satuan</th>
												<th className="px-4 py-3 text-right font-medium">
													Subtotal
												</th>
												<th className="px-4 py-3 text-right font-medium">
													Aksi
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
											{items.map((item, itemIndex) => {
												const selectedProduct = products.find(
													(product) => product.id === item.product_id,
												);
												const branchStock =
													selectedProduct && header.branch_id
														? Number(
															selectedProduct.stock_by_branch[
																header.branch_id
															] ?? 0,
														)
														: null;
												const requestedByOtherRows = selectedProduct
													? items.reduce(
															(total, row, rowIndex) =>
															rowIndex !== itemIndex &&
															row.product_id === selectedProduct.id
																? total + Number(row.quantity || 0)
																: total,
															0,
														)
													: 0;
											const availableForRow =
												branchStock === null
													? null
													: Math.max(
															0,
															branchStock - requestedByOtherRows,
														);
											const exceedsAvailableStock =
												availableForRow !== null &&
												Number(item.quantity || 0) > availableForRow;

												return (
													<tr key={itemIndex}>
														<td className="px-4 py-3 align-top">
															<select
																className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
																value={item.product_id}
																onChange={(event) =>
																	updateItemRow(
																		itemIndex,
																		'product_id',
																		event.target.value,
																	)
																}
																required
															>
																<option value="" disabled>
																	Pilih produk
																</option>
																{products.map((product) => (
																	<option
																		key={product.id}
																		value={product.id}
																	>
																			{product.name} ({product.sku})
																			{header.branch_id !== '' &&
																				` · Stok: ${formatQuantity(Number(product.stock_by_branch[header.branch_id] ?? 0))} ${product.unit}`}
																	</option>
																))}
															</select>
															{selectedProduct && branchStock !== null && (
																<p className="mt-1 text-xs text-muted-foreground">
																	Stok cabang: {formatQuantity(branchStock)}{' '}
																	{selectedProduct.unit}
																</p>
															)}
															<InputError
																message={errorFor(
																	`items.${itemIndex}.product_id`,
																)}
															/>
														</td>
														<td className="px-4 py-3 align-top">
															<div className="flex items-center gap-2">
																<Input
																max={availableForRow ?? undefined}
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
																	{selectedProduct?.unit ?? ''}
																</span>
															</div>
															<InputError
																message={errorFor(
																	`items.${itemIndex}.quantity`,
																)}
															/>
															{availableForRow !== null && (
																<p className="mt-1 text-xs text-muted-foreground">
																	Maks. tersedia untuk baris ini:{' '}
																	{formatQuantity(availableForRow)}{' '}
																	{selectedProduct?.unit}
																</p>
															)}
															{exceedsAvailableStock && (
																<p className="mt-1 text-xs text-destructive">
																	Jumlah melebihi stok cabang yang tersedia.
																</p>
															)}
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
															{formatCurrency(subtotals[itemIndex])}
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
									<p className="text-2xl font-semibold">
										{formatCurrency(totalAmount)}
									</p>
								</div>
								<div className="flex justify-end gap-3">
									<Button asChild variant="outline">
										<Link href={index()}>Batal</Link>
									</Button>
									<Button
										disabled={
											form.processing ||
											hasInvalidItems ||
											hasInvalidHeader
										}
										type="submit"
									>
										{form.processing ? 'Menyimpan...' : 'Simpan Transaksi'}
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
