import { Form, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index } from '@/routes/branches';

export type BranchFormData = {
	id?: number;
	name?: string;
	address?: string | null;
	phone?: string | null;
};

type BranchFormProps = {
	title: string;
	description: string;
	form: {
		action: string;
		method: 'post';
	};
	branch?: BranchFormData;
};

export default function BranchForm({
	title,
	description,
	form,
	branch,
}: BranchFormProps) {
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
										<Label htmlFor="name">Nama Cabang</Label>
										<Input
											id="name"
											name="name"
											defaultValue={branch?.name ?? ''}
											placeholder="Contoh: Cabang Pusat"
											required
										/>
										<InputError message={errors.name} />
									</div>

									<div className="grid gap-2">
										<Label htmlFor="phone">Telepon</Label>
										<Input
											id="phone"
											name="phone"
											defaultValue={branch?.phone ?? ''}
											placeholder="08xxxxxxxxxx"
										/>
										<InputError message={errors.phone} />
									</div>

									<div className="grid gap-2 md:col-span-2">
										<Label htmlFor="address">Alamat</Label>
										<textarea
											className="border-input bg-background min-h-24 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
											id="address"
											name="address"
											defaultValue={branch?.address ?? ''}
											placeholder="Alamat cabang"
										/>
										<InputError message={errors.address} />
									</div>
								</div>

								<div className="flex justify-end gap-3">
									<Button asChild variant="outline">
										<Link href={index()}>Batal</Link>
									</Button>
									<Button disabled={processing} type="submit">
										{processing ? 'Menyimpan...' : 'Simpan Cabang'}
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
