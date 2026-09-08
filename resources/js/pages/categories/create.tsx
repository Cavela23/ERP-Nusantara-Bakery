import { Head } from '@inertiajs/react';
import CategoryForm from './_form';
import { index, store } from '@/routes/categories';

export default function CreateCategory() {
	return (
		<>
			<Head title="Tambah Kategori" />
			<div className="flex h-full flex-1 flex-col gap-6 p-4">
				<CategoryForm
					description="Tambahkan kategori baru untuk produk bakery."
					form={store.form()}
					title="Tambah Kategori"
				/>
			</div>
		</>
	);
}

CreateCategory.layout = {
	breadcrumbs: [
		{ title: 'Categories', href: index() },
		{ title: 'Tambah Kategori', href: '#' },
	],
};
