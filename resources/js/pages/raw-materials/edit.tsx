import { Head } from '@inertiajs/react';
import RawMaterialForm, { type RawMaterialFormData } from './_form';
import { index, update } from '@/routes/raw-materials';

type EditRawMaterialProps = {
	rawMaterial: RawMaterialFormData & { id: number };
};

export default function EditRawMaterial({ rawMaterial }: EditRawMaterialProps) {
	return (
		<>
			<Head title={`Edit ${rawMaterial.name}`} />
			<div className="flex h-full flex-1 flex-col gap-6 p-4">
				<RawMaterialForm
					description="Perbarui informasi bahan baku."
					form={update.form(rawMaterial.id)}
					rawMaterial={rawMaterial}
					title="Edit Bahan Baku"
				/>
			</div>
		</>
	);
}

EditRawMaterial.layout = {
	breadcrumbs: [
		{ title: 'Raw Materials', href: index() },
		{ title: 'Edit Bahan Baku', href: '#' },
	],
};
