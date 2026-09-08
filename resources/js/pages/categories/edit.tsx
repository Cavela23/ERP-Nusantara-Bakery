import { Head } from '@inertiajs/react';
import CategoryForm, { type Category } from './_form';
import { index, update } from '@/routes/categories';

type EditCategoryProps = {
    category: Category & { id: number };
};

export default function EditCategory({ category }: EditCategoryProps) {
    return (
        <>
            <Head title={`Edit ${category.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <CategoryForm
                    category={category}
                    description="Perbarui nama kategori produk."
                    form={update.form(category.id)}
                    title="Edit Kategori"
                />
            </div>
        </>
    );
}

EditCategory.layout = {
    breadcrumbs: [
        { title: 'Categories', href: index() },
        { title: 'Edit Kategori', href: '#' },
    ],
};