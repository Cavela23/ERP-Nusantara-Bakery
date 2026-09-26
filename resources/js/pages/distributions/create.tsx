import { Head } from '@inertiajs/react';
import { index } from '@/routes/distributions';
import type { BranchOption, ProductOption } from './_form';
import DistributionForm from './_form';

type CreateDistributionProps = {
    branches: BranchOption[];
    products: ProductOption[];
};

export default function CreateDistribution({
    branches,
    products,
}: CreateDistributionProps) {
    return (
        <>
            <Head title="Buat Distribusi" />
            <DistributionForm branches={branches} products={products} />
        </>
    );
}

CreateDistribution.layout = {
    breadcrumbs: [
        { title: 'Distribusi', href: index() },
        { title: 'Buat Distribusi', href: '#' },
    ],
};