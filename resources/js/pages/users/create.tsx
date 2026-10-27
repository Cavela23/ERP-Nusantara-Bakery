import { Head } from '@inertiajs/react';
import UserForm from './_form';

type Props = { roles: string[]; branches: { id: number; name: string }[] };

export default function CreateUser({ roles, branches }: Props) {
    return <><Head title="Tambah User" /><div className="flex h-full flex-1 flex-col gap-6 p-4"><UserForm action="/users" method="post" branches={branches} roles={roles} title="Tambah User" description="Buat akun untuk anggota tim." /></div></>;
}

CreateUser.layout = { breadcrumbs: [{ title: 'Manajemen User', href: '/users' }, { title: 'Tambah User', href: '#' }] };
