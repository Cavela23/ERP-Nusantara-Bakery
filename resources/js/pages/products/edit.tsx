import { Head } from '@inertiajs/react';
import ProductForm, {
	type Category,
	type ProductFormData,
} from './_form';
import { index, update } from '@/routes/products';

type EditProductProps = {
	categories: Category[];
	product: ProductFormData & { id: number };
};

export default function EditProduct({
	categories,
	product,
}: EditProductProps) {
	return (
		<>
			<Head title={`Edit ${product.name}`} />
			<div className="flex h-full flex-1 flex-col gap-6 p-4">
				<ProductForm
					categories={categories}
					description="Perbarui informasi dan persediaan produk."
					form={update.form(product.id)}
					product={product}
					title="Edit Produk"
				/>
			</div>
		</>
	);
}

EditProduct.layout = {
	breadcrumbs: [
		{ title: 'Products', href: index() },
		{ title: 'Edit Produk', href: '#' },
	],
};
