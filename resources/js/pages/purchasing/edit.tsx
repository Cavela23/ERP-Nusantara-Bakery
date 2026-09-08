import { Head } from '@inertiajs/react';
import PurchaseOrderForm, {
    type RawMaterialOption,
    type PurchaseOrderFormData,
    type Supplier,
} from './_form';
import { index } from '@/routes/purchasing';

type EditPurchaseOrderProps = {
    purchaseOrder: PurchaseOrderFormData;
    suppliers: Supplier[];
    rawMaterials: RawMaterialOption[];
};

export default function EditPurchaseOrder({
    purchaseOrder,
    suppliers,
    rawMaterials,
}: EditPurchaseOrderProps) {
    return (
        <>
            <Head title={`Edit ${purchaseOrder.po_number ?? 'Purchase Order'}`} />
            <PurchaseOrderForm
                purchaseOrder={purchaseOrder}
                rawMaterials={rawMaterials}
                suppliers={suppliers}
            />
        </>
    );
}

EditPurchaseOrder.layout = {
    breadcrumbs: [
        { title: 'Purchase Orders', href: index() },
        { title: 'Edit PO', href: '#' },
    ],
};
