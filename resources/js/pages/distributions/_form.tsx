import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	index,
	store,
	update,
} from '@/routes/distributions';

export type BranchOption = {
	id: number;
	name: string;
};

export type ProductOption = {
	id: number;
	name: string;
	sku: string;
	unit: string;
	current_stock: number | string;
};

export type DistributionItemInput = {
	product_id: number | '';
	quantity: number | '';
};

export type DistributionFormData = {
	id: number;
	distribution_number: string;
	branch_id: number;
	distribution_date: string;
	notes: string | null;
	items: Array<{
		id?: number;
		product_id: number;
		quantity: number | string;
	}>;
};

type DistributionFormProps = {
	branches: BranchOption[];
	products: ProductOption[];
	distribution?: DistributionFormData;
};

type HeaderState = {
	branch_id: number | '';
	distribution_date: string;
	notes: string;
};

const emptyItem = (): DistributionItemInput => ({
	product_id: '',
	quantity: '',
});

const quantityFormatter = new Intl.NumberFormat('id-ID', {
	maximumFractionDigits: 3,
});

export default function DistributionForm({
	branches,
	products,
	distribution,
}: DistributionFormProps) {
	const isEditing = Boolean(distribution);
	const [header, setHeader] = useState<HeaderState>({
		branch_id: distribution?.branch_id ?? '',
		distribution_date: distribution?.distribution_date.slice(0, 10) ?? '',
		notes: distribution?.notes ?? '',
	});
	const [items, setItems] = useState<DistributionItemInput[]>(
		distribution?.items.length
			? distribution.items.map((item) => ({
				  product_id: item.product_id,
				  quantity: Number(item.quantity),
			  }))
			: [emptyItem()],
	);
	const form = useForm({
		branch_id: header.branch_id,
		distribution_date: header.distribution_date,
		notes: header.notes,
		items,
	});

	const invalidStockProducts = products.filter((product) => {
		const requestedQuantity = items
			.filter((item) => item.product_id === product.id)
			.reduce((total, item) => total + Number(item.quantity || 0), 0);

		return requestedQuantity > Number(product.current_stock);
	});
	const hasInvalidItems =
		items.some(
			(item) => !item.product_id || Number(item.quantity) <= 0,
		) || invalidStockProducts.length > 0;
	const isInvalidHeader = !header.branch_id || !header.distribution_date;

	function updateHeader(field: keyof HeaderState, value: string) {
		setHeader((current) => ({
			...current,
			[field]: field === 'branch_id' ? (value ? Number(value) : '') : value,
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
		field: keyof DistributionItemInput,
		value: string,
	) {
		setItems((current) =>
			current.map((item, index) => {
				if (index !== rowIndex) {
					return item;
				}

				return {
					...item,
					[field]: value === '' ? '' : Number(value),
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

		if (isEditing && distribution) {
			form.put(update.url(distribution.id), { preserveScroll: true });
		} else {
			form.post(store.url(), { preserveScroll: true });
		}
	}

	return (
		<>
			<Head
				title={
					isEditing ? 'Edit Distribusi' : 'Buat Distribusi'
				}
			/>

			<div className="flex h-full flex-1 flex-col gap-6 p-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">
						{isEditing ? 'Edit Distribusi' : 'Buat Distribusi'}
					</h1>
					<p className="text-sm text-muted-foreground">
						Atur cabang tujuan dan produk yang dikirim.
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
											updateHeader(
												'branch_id',
												event.target.value,
											)
										}
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
									<InputError
										message={errorFor('branch_id')}
									/>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="distribution_date">
										Tanggal Distribusi
									</Label>
									<Input
										id="distribution_date"
										type="date"
										value={header.distribution_date}
										onChange={(event) =>
											updateHeader(
												'distribution_date',
												event.target.value,
											)
										}
										required
									/>
									<InputError
										message={errorFor('distribution_date')}
									/>
								</div>

								<div className="grid gap-2 md:col-span-2">
									<Label htmlFor="notes">Catatan</Label>
									<textarea
										className="border-input bg-background min-h-24 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
										id="notes"
										value={header.notes}
										onChange={(event) =>
											updateHeader(
												'notes',
												event.target.value,
											)
										}
										placeholder="Catatan tambahan untuk distribusi"
									/>
									<InputError message={errorFor('notes')} />
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-center justify-between gap-4">
									<h2 className="text-lg font-semibold">
										Item Distribusi
									</h2>
									<Button
										type="button"
										variant="outline"
										onClick={addItemRow}
									>
										+ Tambah Item
									</Button>
								</div>

								<div className="overflow-x-auto rounded-md border border-sidebar-border/70 dark:border-sidebar-border">
									<table className="w-full min-w-[640px] text-left text-sm">
										<thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase dark:border-sidebar-border">
											<tr>
												<th className="px-4 py-3 font-medium">
													Produk
												</th>
												<th className="px-4 py-3 font-medium">
													Jumlah
												</th>
												<th className="px-4 py-3 text-right font-medium">
													Aksi
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
											{items.map((item, itemIndex) => {
												const selectedProduct =
													products.find(
														(product) =>
															product.id ===
															item.product_id,
													);
												const requestedByOtherRows =
													selectedProduct
														? items.reduce(
															  (total, row, rowIndex) =>
																  rowIndex !==
																	  itemIndex &&
																  row.product_id ===
																	  selectedProduct.id
																	  ? total +
																		Number(
																			row.quantity ||
																				0,
																		)
																	  : total,
															  0,
														  )
														: 0;
												const availableForRow =
													selectedProduct
														? Math.max(
															  0,
															  Number(
																  selectedProduct.current_stock,
															  ) -
																  requestedByOtherRows,
														  )
														: 0;
												const exceedsAvailableStock =
													selectedProduct !==
														undefined &&
													Number(item.quantity || 0) >
														availableForRow;

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
																	Pilih produk
																</option>
																{products.map(
																	(product) => (
																		<option
																			key={
																				product.id
																			}
																			value={
																				product.id
																			}
																		>
																			{product.name}{' '}
																			({product.sku})
																			{' · Stok: '}
																			{quantityFormatter.format(
																				Number(
																					product.current_stock,
																				),
																			)}{' '}
																			{product.unit}
																		</option>
																	),
																)}
															</select>
															{selectedProduct && (
																<p className="mt-1 text-xs text-muted-foreground">
																	Stok saat ini:{' '}
																	{quantityFormatter.format(
																		Number(
																			selectedProduct.current_stock,
																		),
																	)}{' '}
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
																	max={
																		selectedProduct
																			? availableForRow
																			: undefined
																	}
																	min="0.001"
																	step="0.001"
																	type="number"
																	value={
																		item.quantity
																	}
																	onChange={(event) =>
																		updateItemRow(
																			itemIndex,
																			'quantity',
																			event.target
																				.value,
																		)
																	}
																	required
																/>
																<span className="whitespace-nowrap text-sm text-muted-foreground">
																	{selectedProduct?.unit ?? ''}
																</span>
															</div>
															{selectedProduct && (
																<p className="mt-1 text-xs text-muted-foreground">
																	Maks. tersedia:{' '}
																	{quantityFormatter.format(
																		availableForRow,
																	)}{' '}
																	{selectedProduct.unit}
																</p>
															)}
															{exceedsAvailableStock && (
																<p className="mt-1 text-xs text-destructive">
																	Jumlah melebihi stok yang tersedia.
																</p>
															)}
															<InputError
																message={errorFor(
																	`items.${itemIndex}.quantity`,
																)}
															/>
														</td>
														<td className="px-4 py-3 text-right align-top">
															<Button
																type="button"
																size="sm"
																variant="destructive"
																onClick={() =>
																	removeItemRow(
																		itemIndex,
																	)
																}
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

							<div className="flex justify-end gap-3 border-t border-sidebar-border/70 pt-6 dark:border-sidebar-border">
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
									{form.processing
										? 'Menyimpan...'
										: isEditing
										  ? 'Simpan Perubahan'
										  : 'Simpan Distribusi'}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
