import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { create, index } from '@/routes/sales';

type Branch = { id: number; name: string };
type User = { id: number; name: string };
type Sale = {
	id: number;
	sale_number: string;
	branch: Branch;
	sale_date: string;
	total_amount: string | number;
	creator: User;
};

type PaginationLink = {
	url: string | null;
	label: string;
	active: boolean;
};

type PaginatedSales = {
	data: Sale[];
	links: PaginationLink[];
	current_page: number;
	last_page: number;
	from: number | null;
	to: number | null;
	total: number;
};

type SalesIndexProps = {
	sales: PaginatedSales;
};

const currencyFormatter = new Intl.NumberFormat('id-ID', {
	style: 'currency',
	currency: 'IDR',
	maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
	dateStyle: 'medium',
});

export default function SalesIndex({ sales }: SalesIndexProps) {
	return (
		<>
			<Head title="Transaksi Penjualan" />

			<div className="flex h-full flex-1 flex-col gap-6 p-4">
				<div className="flex items-center justify-between gap-4">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">
							Transaksi Penjualan
						</h1>
						<p className="text-sm text-muted-foreground">
							Riwayat transaksi penjualan produk.
						</p>
					</div>
					<Button asChild>
						<Link href={create()}>Buat Transaksi</Link>
					</Button>
				</div>

				<Card className="overflow-hidden border-sidebar-border/70 py-0 dark:border-sidebar-border">
					<div className="overflow-x-auto">
						<table className="w-full min-w-[760px] text-left text-sm">
							<thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase dark:border-sidebar-border">
								<tr>
									<th className="px-6 py-4 font-medium">No. Transaksi</th>
									<th className="px-6 py-4 font-medium">Cabang</th>
									<th className="px-6 py-4 font-medium">Tanggal</th>
									<th className="px-6 py-4 text-right font-medium">Total</th>
									<th className="px-6 py-4 font-medium">Dicatat oleh</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
								{sales.data.length === 0 ? (
									<tr>
										<td
											className="px-6 py-12 text-center text-muted-foreground"
											colSpan={5}
										>
											Belum ada transaksi penjualan.
										</td>
									</tr>
								) : (
									sales.data.map((sale) => (
										<tr
											className="transition-colors hover:bg-muted/30"
											key={sale.id}
										>
											<td className="px-6 py-4 font-medium">
												{sale.sale_number}
											</td>
											<td className="px-6 py-4">{sale.branch.name}</td>
											<td className="px-6 py-4">
												{dateFormatter.format(
													new Date(
														`${sale.sale_date.slice(0, 10)}T00:00:00`,
													),
												)}
											</td>
											<td className="px-6 py-4 text-right">
												{currencyFormatter.format(
													Number(sale.total_amount),
												)}
											</td>
											<td className="px-6 py-4">{sale.creator.name}</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</Card>

				{sales.last_page > 1 && (
					<nav
						aria-label="Pagination sales"
						className="flex flex-wrap justify-end gap-2"
					>
						{sales.links.map((link, linkIndex) =>
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
									<span dangerouslySetInnerHTML={{ __html: link.label }} />
								</Link>
							) : (
								<span
									className="rounded-md border border-sidebar-border/40 px-3 py-2 text-sm text-muted-foreground"
									key={`${link.label}-${linkIndex}`}
								>
									<span dangerouslySetInnerHTML={{ __html: link.label }} />
								</span>
							),
						)}
					</nav>
				)}
			</div>
		</>
	);
}

SalesIndex.layout = {
	breadcrumbs: [
		{
			title: 'Transaksi Penjualan',
			href: index(),
		},
	],
};
