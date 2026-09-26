import { Head } from '@inertiajs/react';
import { index } from '@/routes/distributions';
import type {
    BranchOption,
    DistributionFormData,
    ProductOption,
} from './_form';
import DistributionForm from './_form';

type EditDistributionProps = {
    branches: BranchOption[];
    products: ProductOption[];
    distribution: DistributionFormData;
};

export default function EditDistribution({
    branches,
    products,
    distribution,
}: EditDistributionProps) {
    return (
        <>
            <Head title={`Edit ${distribution.distribution_number}`} />
            <DistributionForm
                branches={branches}
                distribution={distribution}
                products={products}
            />
        </>
    );
}

EditDistribution.layout = {
    breadcrumbs: [
        { title: 'Distribusi', href: index() },
        { title: 'Edit Distribusi', href: '#' },
    ],
};