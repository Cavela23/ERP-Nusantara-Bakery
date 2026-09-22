import { Head } from '@inertiajs/react';
import { index, update } from '@/routes/branches';
import BranchForm from './_form';
import type { BranchFormData } from './_form';

type EditBranchProps = {
	branch: BranchFormData & { id: number };
};

export default function EditBranch({ branch }: EditBranchProps) {
	return (
		<>
			<Head title={`Edit ${branch.name}`} />
			<div className="flex h-full flex-1 flex-col gap-6 p-4">
				<BranchForm
					description="Perbarui informasi cabang."
					form={update.form(branch.id)}
					branch={branch}
					title="Edit Cabang"
				/>
			</div>
		</>
	);
}

EditBranch.layout = {
	breadcrumbs: [
		{ title: 'Branches', href: index() },
		{ title: 'Edit Cabang', href: '#' },
	],
};
