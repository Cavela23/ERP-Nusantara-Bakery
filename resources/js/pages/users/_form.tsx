import { Form, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Role = string;
type Branch = { id: number; name: string };

export type ManagedUser = {
    id?: number;
    name: string;
    email: string;
    roles?: { name: string }[];
    branch?: Branch | null;
    branch_id?: number | null;
};

type UserFormProps = {
    user?: ManagedUser;
    roles: Role[];
    branches: Branch[];
    action: string;
    method: 'post' | 'put';
    title: string;
    description: string;
};

export default function UserForm({
    user,
    roles,
    branches,
    action,
    method,
    title,
    description,
}: UserFormProps) {
    const currentRole = user?.roles?.[0]?.name ?? '';
    const currentBranch = user?.branch_id ?? user?.branch?.id;

    return (
        <>
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                <CardContent className="pt-6">
                    <Form
                        action={action}
                        method={method}
                        options={{ preserveScroll: true }}
                        className="space-y-6"
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nama</Label>
                                        <Input id="name" name="name" defaultValue={user?.name ?? ''} required />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" name="email" type="email" defaultValue={user?.email ?? ''} required />
                                        <InputError message={errors.email} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">
                                            Password {user ? '(kosongkan jika tidak diubah)' : ''}
                                        </Label>
                                        <Input id="password" name="password" type="password" minLength={8} required={!user} />
                                        <InputError message={errors.password} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                        <Input id="password_confirmation" name="password_confirmation" type="password" minLength={8} required={!user} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="role">Role</Label>
                                        <select id="role" name="role" defaultValue={currentRole} required className="border-input bg-background h-9 rounded-md border px-3 text-sm">
                                            <option value="" disabled>Pilih role</option>
                                            {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                                        </select>
                                        <InputError message={errors.role} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="branch_id">Cabang (opsional)</Label>
                                        <select id="branch_id" name="branch_id" defaultValue={currentBranch?.toString() ?? ''} className="border-input bg-background h-9 rounded-md border px-3 text-sm">
                                            <option value="">Semua cabang</option>
                                            {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
                                        </select>
                                        <InputError message={errors.branch_id} />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button asChild variant="outline"><Link href="/users">Batal</Link></Button>
                                    <Button disabled={processing} type="submit">{processing ? 'Menyimpan...' : 'Simpan Akun'}</Button>
                                </div>
                            </>
                        )}
                    </Form>
                </CardContent>
            </Card>
        </>
    );
}
