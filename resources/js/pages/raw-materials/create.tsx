import { Head } from '@inertiajs/react';
import RawMaterialForm from './_form';
import { index, store } from '@/routes/raw-materials';

export default function CreateRawMaterial() {
	return (
		<>
			<Head title="Tambah Bahan Baku" />
			<div className="flex h-full flex-1 flex-col gap-6 p-4">
				<RawMaterialForm
					description="Tambahkan bahan baku baru ke master data."
					form={store.form()}
					title="Tambah Bahan Baku"
				/>
			</div>
		</>
	);
}

CreateRawMaterial.layout = {
	breadcrumbs: [
		{ title: 'Raw Materials', href: index() },
		{ title: 'Tambah Bahan Baku', href: '#' },
	],
};
