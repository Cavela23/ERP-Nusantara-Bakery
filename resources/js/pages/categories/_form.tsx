import { Form, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index } from '@/routes/categories';

export type Category = {
    id?: number;
    name?: string;
};

type CategoryFormProps = {
    title: string;
    description: string;
    form: {
        action: string;
        method: 'post';
    };
    category?: Category;
};

export default function CategoryForm({
    title,
    description,
    form,
    category,
}: CategoryFormProps) {
    return (
        <>
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                <CardContent className="pt-6">
                    <Form
                        {...form}
                        options={{ preserveScroll: true }}
                        className="space-y-6"
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama Kategori</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={category?.name ?? ''}
                                        placeholder="Contoh: Roti"
                                        required
                                        autoFocus
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Button asChild variant="outline">
                                        <Link href={index()}>Batal</Link>
                                    </Button>
                                    <Button disabled={processing} type="submit">
                                        {processing ? 'Menyimpan...' : 'Simpan Kategori'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </CardContent>
            </Card>
        </>
    );
}