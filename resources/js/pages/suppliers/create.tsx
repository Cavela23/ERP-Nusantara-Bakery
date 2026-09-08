import { Head } from '@inertiajs/react';
import SupplierForm from './_form';
import { index, store } from '@/routes/suppliers';

export default function CreateSupplier() {
    return (
        <>
            <Head title="Tambah Supplier" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <SupplierForm
                    description="Tambahkan supplier baru ke data pemasok."
                    form={store.form()}
                    title="Tambah Supplier"
                />
            </div>
        </>
    );
}

CreateSupplier.layout = {
    breadcrumbs: [
        { title: 'Suppliers', href: index() },
        { title: 'Tambah Supplier', href: '#' },
    ],
};
