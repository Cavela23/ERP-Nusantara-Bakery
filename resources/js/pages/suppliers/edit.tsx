import { Head } from '@inertiajs/react';
import SupplierForm, { type SupplierFormData } from './_form';
import { index, update } from '@/routes/suppliers';

type EditSupplierProps = {
    supplier: SupplierFormData & { id: number };
};

export default function EditSupplier({ supplier }: EditSupplierProps) {
    return (
        <>
            <Head title={`Edit ${supplier.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <SupplierForm
                    description="Perbarui informasi supplier."
                    form={update.form(supplier.id)}
                    supplier={supplier}
                    title="Edit Supplier"
                />
            </div>
        </>
    );
}

EditSupplier.layout = {
    breadcrumbs: [
        { title: 'Suppliers', href: index() },
        { title: 'Edit Supplier', href: '#' },
    ],
};
