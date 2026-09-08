import { Form, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index } from '@/routes/raw-materials';

export type RawMaterialFormData = {
	id?: number;
	name?: string;
	sku?: string;
	unit?: string;
	price?: string | number;
	stock_min?: string | number;
};

type RawMaterialFormProps = {
	title: string;
	description: string;
	form: {
		action: string;
		method: 'post';
	};
	rawMaterial?: RawMaterialFormData;
};

export default function RawMaterialForm({
	title,
	description,
	form,
	rawMaterial,
}: RawMaterialFormProps) {
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
								<div className="grid gap-6 md:grid-cols-2">
									<div className="grid gap-2 md:col-span-2">
										<Label htmlFor="name">Nama Bahan Baku</Label>
										<Input
											id="name"
											name="name"
											defaultValue={rawMaterial?.name ?? ''}
											placeholder="Contoh: Tepung Terigu"
											required
										/>
										<InputError message={errors.name} />
									</div>

									<div className="grid gap-2">
										<Label htmlFor="sku">SKU</Label>
										<Input
											id="sku"
											name="sku"
											defaultValue={rawMaterial?.sku ?? ''}
											placeholder="Contoh: RM-001"
											required
										/>
										<InputError message={errors.sku} />
									</div>

									<div className="grid gap-2">
										<Label htmlFor="unit">Satuan</Label>
										<Input
											id="unit"
											name="unit"
											defaultValue={rawMaterial?.unit ?? 'kg'}
											placeholder="kg, liter, pcs"
											required
										/>
										<InputError message={errors.unit} />
									</div>

									<div className="grid gap-2">
										<Label htmlFor="price">Harga</Label>
										<Input
											id="price"
											name="price"
											defaultValue={rawMaterial?.price ?? ''}
											min="0"
											step="0.01"
											type="number"
											required
										/>
										<InputError message={errors.price} />
									</div>

									<div className="grid gap-2">
										<Label htmlFor="stock_min">Stok Minimum</Label>
										<Input
											id="stock_min"
											name="stock_min"
											defaultValue={rawMaterial?.stock_min ?? ''}
											min="0"
											step="0.001"
											type="number"
											required
										/>
										<InputError message={errors.stock_min} />
									</div>
								</div>

								<div className="flex justify-end gap-3">
									<Button asChild variant="outline">
										<Link href={index()}>Batal</Link>
									</Button>
									<Button disabled={processing} type="submit">
										{processing ? 'Menyimpan...' : 'Simpan Bahan Baku'}
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
