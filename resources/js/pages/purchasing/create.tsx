import { Head } from '@inertiajs/react';
import PurchaseOrderForm, {
    type RawMaterialOption,
    type Supplier,
} from './_form';
import { index } from '@/routes/purchasing';

type CreatePurchaseOrderProps = {
    suppliers: Supplier[];
    rawMaterials: RawMaterialOption[];
};

export default function CreatePurchaseOrder({
    suppliers,
    rawMaterials,
}: CreatePurchaseOrderProps) {
    return (
        <>
            <Head title="Buat Purchase Order" />
            <PurchaseOrderForm
                rawMaterials={rawMaterials}
                suppliers={suppliers}
            />
        </>
    );
}

CreatePurchaseOrder.layout = {
    breadcrumbs: [
        { title: 'Purchase Orders', href: index() },
        { title: 'Buat PO', href: '#' },
    ],
};
