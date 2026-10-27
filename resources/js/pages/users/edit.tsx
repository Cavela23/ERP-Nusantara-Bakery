import { Head } from '@inertiajs/react';
import UserForm, { type ManagedUser } from './_form';

type Props = { user: ManagedUser & { id: number }; roles: string[]; branches: { id: number; name: string }[] };

export default function EditUser({ user, roles, branches }: Props) {
    return <><Head title={`Edit ${user.name}`} /><div className="flex h-full flex-1 flex-col gap-6 p-4"><UserForm action={`/users/${user.id}`} method="put" branches={branches} roles={roles} title="Edit User" description="Perbarui data dan role akun." user={user} /></div></>;
}

EditUser.layout = { breadcrumbs: [{ title: 'Manajemen User', href: '/users' }, { title: 'Edit User', href: '#' }] };
