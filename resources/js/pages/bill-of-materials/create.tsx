import { Head } from '@inertiajs/react';
import { index } from '@/routes/bill-of-materials';
import BillOfMaterialForm from './_form';
import type { ProductOption, RawMaterialOption } from './_form';

type CreateBillOfMaterialProps = {
    products: ProductOption[];
    rawMaterials: RawMaterialOption[];
};

export default function CreateBillOfMaterial({
    products,
    rawMaterials,
}: CreateBillOfMaterialProps) {
    return (
        <>
            <Head title="Buat Resep" />
            <BillOfMaterialForm
                products={products}
                rawMaterials={rawMaterials}
            />
        </>
    );
}

CreateBillOfMaterial.layout = {
    breadcrumbs: [
        { title: 'Resep Produk', href: index() },
        { title: 'Buat Resep', href: '#' },
    ],
};
