import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index } from '@/routes/production-orders';

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
	notes: string | null;
};

type StockMovement = {
	id: number;
	quantity: string | number;
	stockable: {
		name: string;
	};
};

type ProductionOrderShowProps = {
	productionOrder: ProductionOrder;
	materialsUsed: StockMovement[];
};

const quantityFormatter = new Intl.NumberFormat('id-ID', {
	minimumFractionDigits: 0,
	maximumFractionDigits: 3,
});

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
	dateStyle: 'medium',
});

export default function ProductionOrderShow({
	productionOrder,
	materialsUsed,
}: ProductionOrderShowProps) {
	return (
		<>
			<Head title={`Detail ${productionOrder.production_number}`} />

			<div className="flex h-full flex-1 flex-col gap-6 p-4">
				<div className="flex items-center justify-between gap-4">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">
							Detail Produksi
						</h1>
						<p className="text-sm text-muted-foreground">
							{productionOrder.production_number}
						</p>
					</div>
					<Link
						className="text-sm font-medium text-primary hover:underline"
						href={index()}
					>
						Kembali
					</Link>
				</div>

				<Card className="border-sidebar-border/70 dark:border-sidebar-border">
					<CardHeader>
						<CardTitle>Informasi Produksi</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-5 sm:grid-cols-2">
						<div>
							<p className="text-sm text-muted-foreground">No. Produksi</p>
							<p className="font-medium">{productionOrder.production_number}</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Produk</p>
							<p className="font-medium">{productionOrder.product.name}</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Jumlah diproduksi</p>
							<p className="font-medium">
								{quantityFormatter.format(Number(productionOrder.quantity))}
							</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Tanggal</p>
							<p className="font-medium">
								{dateFormatter.format(new Date(productionOrder.production_date))}
							</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Dicatat oleh</p>
							<p className="font-medium">{productionOrder.creator.name}</p>
						</div>
						{productionOrder.notes && (
							<div className="sm:col-span-2">
								<p className="text-sm text-muted-foreground">Catatan</p>
								<p className="whitespace-pre-wrap font-medium">
									{productionOrder.notes}
								</p>
							</div>
						)}
					</CardContent>
				</Card>

				<Card className="overflow-hidden border-sidebar-border/70 py-0 dark:border-sidebar-border">
					<CardHeader className="py-6">
						<CardTitle>Bahan Baku Terpakai</CardTitle>
					</CardHeader>
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm">
							<thead className="border-y border-sidebar-border/70 bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase dark:border-sidebar-border">
								<tr>
									<th className="px-6 py-4 font-medium">Nama Bahan</th>
									<th className="px-6 py-4 font-medium">Jumlah Terpakai</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
								{materialsUsed.length === 0 ? (
									<tr>
										<td
											className="px-6 py-8 text-center text-muted-foreground"
											colSpan={2}
										>
											Belum ada bahan baku yang tercatat.
										</td>
									</tr>
								) : (
									materialsUsed.map((movement) => (
										<tr key={movement.id}>
											<td className="px-6 py-4 font-medium">
												{movement.stockable.name}
											</td>
											<td className="px-6 py-4">
												{quantityFormatter.format(Number(movement.quantity))}
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

ProductionOrderShow.layout = {
	breadcrumbs: [
		{
			title: 'Production Orders',
			href: index(),
		},
	],
};