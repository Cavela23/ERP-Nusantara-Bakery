	import { Head } from '@inertiajs/react';
	import { index, store } from '@/routes/branches';
	import BranchForm from './_form';

	export default function CreateBranch() {
		return (
			<>
				<Head title="Tambah Cabang" />
				<div className="flex h-full flex-1 flex-col gap-6 p-4">
					<BranchForm
						description="Tambahkan cabang baru ke data cabang."
						form={store.form()}
						title="Tambah Cabang"
					/>
				</div>
			</>
		);
	}

	CreateBranch.layout = {
		breadcrumbs: [
			{ title: 'Branches', href: index() },
			{ title: 'Tambah Cabang', href: '#' },
		],
	};
    