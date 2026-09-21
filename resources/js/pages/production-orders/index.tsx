import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { create, index, show } from '@/routes/production-orders';

type Product = {
	id: number;
	name: string;
};

type User = {
	id: number;
	name: string;
};

type ProductionOrder = {
	id: number;
	production_number: string;
	product: Product;
	quantity: string | number;
	production_date: string;
	creator: User;
};

type PaginationLink = {
	url: string | null;
	label: string;
	active: boolean;
};

type PaginatedProductionOrders = {
	data: ProductionOrder[];
	links: PaginationLink[];
	last_page: number;
};

type ProductionOrderIndexProps = {
	productionOrders: PaginatedProductionOrders;
};

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
	dateStyle: 'medium',
});

export default function ProductionOrderIndex({
	productionOrders,
}: ProductionOrderIndexProps) {
	return (
		<>
			<Head title="Production Orders" />

			<div className="flex h-full flex-1 flex-col gap-6 p-4">
				<div className="flex items-center justify-between gap-4">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">
							Production Orders
						</h1>
						<p className="text-sm text-muted-foreground">
							Riwayat produksi yang sudah dicatat.
						</p>
					</div>

					<Button asChild>
						<Link href={create()}>Buat Produksi</Link>
					</Button>
				</div>

				<Card className="overflow-hidden border-sidebar-border/70 py-0 dark:border-sidebar-border">
					<div className="overflow-x-auto">
						<table className="w-full min-w-[720px] text-left text-sm">
							<thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase dark:border-sidebar-border">
								<tr>
									<th className="px-6 py-4 font-medium">
										No. Produksi
									</th>
									<th className="px-6 py-4 font-medium">
										Produk
									</th>
									<th className="px-6 py-4 font-medium">
										Jumlah
									</th>
									<th className="px-6 py-4 font-medium">
										Tanggal
									</th>
									<th className="px-6 py-4 font-medium">
										Dicatat oleh
									</th>
									<th className="px-6 py-4 font-medium">Aksi</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
								{productionOrders.data.length === 0 ? (
									<tr>
										<td
											className="px-6 py-12 text-center text-muted-foreground"
																				colSpan={6}
										>
											Belum ada produksi yang dicatat.
										</td>
									</tr>
								) : (
									productionOrders.data.map((productionOrder) => (
										<tr
											className="transition-colors hover:bg-muted/30"
											key={productionOrder.id}
										>
											<td className="px-6 py-4 font-medium">
												{productionOrder.production_number}
											</td>
											<td className="px-6 py-4">
												{productionOrder.product.name}
											</td>
											<td className="px-6 py-4">
												{Number(
													productionOrder.quantity,
												).toFixed(3)}
											</td>
											<td className="px-6 py-4">
												{dateFormatter.format(
													new Date(
														productionOrder.production_date,
													),
												)}
											</td>
											<td className="px-6 py-4">
												{productionOrder.creator.name}
											</td>
													<td className="px-6 py-4">
														<Link
															className="text-sm font-medium text-primary hover:underline"
															href={show(productionOrder.id)}
														>
															Detail
														</Link>
													</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</Card>

				{productionOrders.last_page > 1 && (
					<nav
						aria-label="Pagination production orders"
						className="flex flex-wrap justify-end gap-2"
					>
						{productionOrders.links.map((link, linkIndex) =>
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

ProductionOrderIndex.layout = {
	breadcrumbs: [
		{
			title: 'Production Orders',
			href: index(),
		},
	],
};
