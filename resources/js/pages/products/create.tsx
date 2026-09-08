import { Head } from '@inertiajs/react';
import ProductForm, { type Category } from './_form';
import { index, store } from '@/routes/products';

type CreateProductProps = {
	categories: Category[];
};

export default function CreateProduct({ categories }: CreateProductProps) {
	return (
		<>
			<Head title="Tambah Produk" />
			<div className="flex h-full flex-1 flex-col gap-6 p-4">
				<ProductForm
					categories={categories}
					description="Tambahkan produk baru ke katalog bakery."
					form={store.form()}
					title="Tambah Produk"
				/>
			</div>
		</>
	);
}

CreateProduct.layout = {
	breadcrumbs: [
		{ title: 'Products', href: index() },
		{ title: 'Tambah Produk', href: '#' },
	],
};
