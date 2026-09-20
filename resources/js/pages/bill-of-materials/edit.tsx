import { Head } from '@inertiajs/react';
import { index } from '@/routes/bill-of-materials';
import BillOfMaterialForm from './_form';
import type {
    BillOfMaterialItem,
    ProductOption,
    RawMaterialOption,
} from './_form';

type EditBillOfMaterialProps = {
    product: ProductOption;
    items: BillOfMaterialItem[];
    rawMaterials: RawMaterialOption[];
};

export default function EditBillOfMaterial({
    product,
    items,
    rawMaterials,
}: EditBillOfMaterialProps) {
    return (
        <>
            <Head title={`Edit Resep ${product.name}`} />
            <BillOfMaterialForm
                items={items}
                product={product}
                products={[]}
                rawMaterials={rawMaterials}
            />
        </>
    );
}

EditBillOfMaterial.layout = {
    breadcrumbs: [
        { title: 'Resep Produk', href: index() },
        { title: 'Edit Resep', href: '#' },
    ],
};
