import { Head } from '@inertiajs/react';
import { index } from '@/routes/sales';
import SaleForm from './_form';
import type { BranchOption, ProductOption } from './_form';

type CreateSaleProps = {
	branches: BranchOption[];
	products: ProductOption[];
};

export default function CreateSale({ branches, products }: CreateSaleProps) {
	return (
		<>
			<Head title="Buat Transaksi Penjualan" />
			<SaleForm branches={branches} products={products} />
		</>
	);
}

CreateSale.layout = {
	breadcrumbs: [
		{ title: 'Transaksi Penjualan', href: index() },
		{ title: 'Buat Transaksi', href: '#' },
	],
};
