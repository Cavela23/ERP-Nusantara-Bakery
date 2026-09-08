import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
	create,
	destroy,
	edit,
	index,
} from '@/routes/categories';

type Category = {
	id: number;
	name: string;
};

type PaginationLink = {
	url: string | null;
	label: string;
	active: boolean;
};

type PaginatedCategories = {
	data: Category[];
	links: PaginationLink[];
	current_page: number;
	last_page: number;
	from: number | null;
	to: number | null;
	total: number;
};

type CategoriesIndexProps = {
	categories: PaginatedCategories;
};

export default function CategoriesIndex({
	categories,
}: CategoriesIndexProps) {
	function handleDelete(category: Category) {
		if (!window.confirm(`Hapus kategori "${category.name}"?`)) {
			return;
		}

		router.delete(destroy.url(category.id), {
			preserveScroll: true,
		});
	}

	return (
		<>
			<Head title="Categories" />

			<div className="flex h-full flex-1 flex-col gap-6 p-4">
				<div className="flex items-center justify-between gap-4">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">
							Categories
						</h1>
						<p className="text-sm text-muted-foreground">
							Kelola kategori produk bakery.
						</p>
					</div>

					<Button asChild>
						<Link href={create()}>Tambah Kategori</Link>
					</Button>
				</div>

				<Card className="overflow-hidden border-sidebar-border/70 py-0 dark:border-sidebar-border">
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm">
							<thead className="border-b border-sidebar-border/70 bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground dark:border-sidebar-border">
								<tr>
									<th className="px-6 py-4 font-medium">Nama</th>
									<th className="px-6 py-4 text-right font-medium">Aksi</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
								{categories.data.length === 0 ? (
									<tr>
										<td
											className="px-6 py-12 text-center text-muted-foreground"
											colSpan={2}
										>
											Belum ada kategori.
										</td>
									</tr>
								) : (
									categories.data.map((category) => (
										<tr
											className="transition-colors hover:bg-muted/30"
											key={category.id}
										>
											<td className="px-6 py-4 font-medium">
												{category.name}
											</td>
											<td className="px-6 py-4">
												<div className="flex justify-end gap-2">
													<Button
														asChild
														size="sm"
														variant="outline"
													>
														<Link href={edit(category.id)}>
															Edit
														</Link>
													</Button>
													<Button
														size="sm"
														variant="destructive"
														onClick={() =>
															handleDelete(category)
														}
													>
														Hapus
													</Button>
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</Card>

				{categories.last_page > 1 && (
					<nav
						aria-label="Pagination categories"
						className="flex flex-wrap justify-end gap-2"
					>
						{categories.links.map((link, linkIndex) =>
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

CategoriesIndex.layout = {
	breadcrumbs: [
		{
			title: 'Categories',
			href: index(),
		},
	],
};
