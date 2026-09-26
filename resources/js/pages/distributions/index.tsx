import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
	create,
	destroy,
	edit,
	markAsReceived,
	markAsShipped,
} from '@/routes/distributions';

type Branch = { id: number; name: string };
type DistributionStatus = 'pending' | 'shipped' | 'received';
type Distribution = {
	id: number;
	distribution_number: string;
	branch: Branch;
	distribution_date: string;
	status: DistributionStatus;
};
type PaginationLink = { url: string | null; label: string; active: boolean };
type PaginatedDistributions = {
	data: Distribution[];
	links: PaginationLink[];
	current_page: number;
	last_page: number;
	from: number | null;
	to: number | null;
	total: number;
};

type DistributionsIndexProps = { distributions: PaginatedDistributions };

function getStatusBadge(status: DistributionStatus) {
	switch (status) {
		case 'pending':
			return { variant: 'secondary' as const, className: '' };
		case 'shipped':
			return { variant: 'default' as const, className: '' };
		case 'received':
			return {
				variant: 'outline' as const,
				className: 'border-green-600 text-green-600',
			};
	}
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
	dateStyle: 'medium',
});

export default function DistributionsIndex({
	distributions,
}: DistributionsIndexProps) {
	function handleDelete(distribution: Distribution) {
		if (
			!window.confirm(
				`Hapus distribusi "${distribution.distribution_number}"?`,
			)
		) {
			return;
		}

		router.delete(destroy.url(distribution.id), { preserveScroll: true });
	}

	function handleMarkAsShipped(distribution: Distribution) {
		if (
			!window.confirm(
				`Tandai distribusi "${distribution.distribution_number}" sebagai dikirim?`,
			)
		) {
			return;
		}

		router.post(
			markAsShipped.url(distribution.id),
			{},
			{
				preserveScroll: true,
				onError: (errors) => {
					if (errors.stock) {
						window.alert(errors.stock);
					}
				},
			},
		);
	}

	function handleMarkAsReceived(distribution: Distribution) {
		if (
			!window.confirm(
				`Konfirmasi distribusi "${distribution.distribution_number}" sudah diterima?`,
			)
		) {
			return;
		}

		router.post(
			markAsReceived.url(distribution.id),
			{},
			{ preserveScroll: true },
		);
	}

	return (
		<>
			<Head title="Distribusi" />

			<div className="flex h-full flex-1 flex-col gap-6 p-4">
				<div className="flex items-center justify-between gap-4">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">
							Distribusi
						</h1>
						<p className="text-sm text-muted-foreground">
							Kelola pengiriman produk ke cabang.
						</p>
					</div>

					<Button asChild>
						<Link href={create()}>Buat Distribusi</Link>
					</Button>
				</div>

				<Card className="overflow-hidden border-sidebar-border/70 py-0 dark:border-sidebar-border">
					<div className="overflow-x-auto">
						<table className="w-full min-w-[760px] text-left text-sm">
							<thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase dark:border-sidebar-border">
								<tr>
									<th className="px-6 py-4 font-medium">
										No. Distribusi
									</th>
									<th className="px-6 py-4 font-medium">
										Cabang
									</th>
									<th className="px-6 py-4 font-medium">
										Tanggal
									</th>
									<th className="px-6 py-4 font-medium">
										Status
									</th>
									<th className="px-6 py-4 text-right font-medium">
										Aksi
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
								{distributions.data.length === 0 ? (
									<tr>
										<td
											className="px-6 py-12 text-center text-muted-foreground"
											colSpan={5}
										>
											Belum ada distribusi.
										</td>
									</tr>
								) : (
									distributions.data.map((distribution) => {
										const statusBadge = getStatusBadge(
											distribution.status,
										);

										return (
											<tr
												className="transition-colors hover:bg-muted/30"
												key={distribution.id}
											>
												<td className="px-6 py-4 font-medium">
													{distribution.distribution_number}
												</td>
												<td className="px-6 py-4">
													{distribution.branch.name}
												</td>
												<td className="px-6 py-4">
													{dateFormatter.format(
														new Date(
															distribution.distribution_date,
														),
													)}
												</td>
												<td className="px-6 py-4">
													<Badge
														className={statusBadge.className}
														variant={statusBadge.variant}
													>
														{distribution.status}
													</Badge>
												</td>
												<td className="px-6 py-4">
													<div className="flex justify-end gap-2">
														{distribution.status ===
														'pending' ? (
															<>
																<Button
																	size="sm"
																	variant="default"
																	onClick={() =>
																		handleMarkAsShipped(
																			distribution,
																		)
																	}
																>
																	Tandai Dikirim
																</Button>
																<Button
																	asChild
																	size="sm"
																	variant="outline"
																>
																	<Link
																		href={edit(
																			distribution.id,
																		)}
																	>
																		Edit
																	</Link>
																</Button>
																<Button
																	size="sm"
																	variant="destructive"
																	onClick={() =>
																		handleDelete(
																			distribution,
																		)
																	}
																>
																	Hapus
																</Button>
															</>
														) : distribution.status ===
														  'shipped' ? (
															<Button
																size="sm"
																variant="secondary"
																onClick={() =>
																	handleMarkAsReceived(
																		distribution,
																	)
																}
															>
																Konfirmasi Diterima
															</Button>
														) : (
															<span className="px-3 py-2 text-xs text-muted-foreground">
																Selesai
															</span>
														)}
													</div>
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>
					</div>

					{distributions.last_page > 1 && (
						<nav className="flex flex-wrap items-center justify-between gap-3 border-t border-sidebar-border/70 px-6 py-4 dark:border-sidebar-border">
							<p className="text-sm text-muted-foreground">
								Menampilkan {distributions.from ?? 0}–
								{distributions.to ?? 0} dari {distributions.total}
							</p>
							<div className="flex flex-wrap gap-1">
								{distributions.links.map((paginationLink, index) => (
									<Button
										asChild
										key={`${paginationLink.label}-${index}`}
										size="sm"
										variant={
											paginationLink.active
												? 'default'
												: 'outline'
										}
										disabled={!paginationLink.url}
									>
										<Link
											href={paginationLink.url ?? '#'}
											preserveScroll
										>
											<span
												dangerouslySetInnerHTML={{
													__html: paginationLink.label,
												}}
											/>
										</Link>
									</Button>
								))}
							</div>
						</nav>
					)}
				</Card>
			</div>
		</>
	);
}
