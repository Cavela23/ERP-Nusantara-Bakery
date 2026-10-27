import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type User = { id: number; name: string; email: string; roles: { name: string }[]; branch?: { name: string } | null };
type Props = { users: { data: User[]; links: { url: string | null; label: string; active: boolean }[]; last_page: number } };

export default function UsersIndex({ users }: Props) {
    function removeUser(user: User) {
        if (window.confirm(`Hapus akun "${user.name}"?`)) router.delete(`/users/${user.id}`, { preserveScroll: true });
    }

    return <><Head title="Manajemen User" /><div className="flex h-full flex-1 flex-col gap-6 p-4">
        <div className="flex items-center justify-between gap-4"><div><h1 className="text-2xl font-semibold tracking-tight">Manajemen User</h1><p className="text-sm text-muted-foreground">Buat akun dan atur role pengguna.</p></div><Button asChild><Link href="/users/create">Tambah User</Link></Button></div>
        <Card className="overflow-hidden border-sidebar-border/70 py-0 dark:border-sidebar-border"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground"><tr><th className="px-6 py-4">Nama</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">Cabang</th><th className="px-6 py-4 text-right">Aksi</th></tr></thead><tbody className="divide-y">{users.data.map((user) => <tr key={user.id}><td className="px-6 py-4 font-medium">{user.name}</td><td className="px-6 py-4">{user.email}</td><td className="px-6 py-4">{user.roles.map((role) => role.name).join(', ') || '-'}</td><td className="px-6 py-4">{user.branch?.name ?? 'Semua cabang'}</td><td className="px-6 py-4"><div className="flex justify-end gap-2"><Button asChild size="sm" variant="outline"><Link href={`/users/${user.id}/edit`}>Edit</Link></Button><Button size="sm" variant="destructive" onClick={() => removeUser(user)}>Hapus</Button></div></td></tr>)}</tbody></table></div></Card>
        {users.last_page > 1 && <nav className="flex justify-end gap-2">{users.links.map((link, index) => link.url ? <Link className="rounded-md border px-3 py-2 text-sm" href={link.url} key={`${link.label}-${index}`} dangerouslySetInnerHTML={{ __html: link.label }} /> : <span className="rounded-md border px-3 py-2 text-sm text-muted-foreground" key={`${link.label}-${index}`} dangerouslySetInnerHTML={{ __html: link.label }} />)}</nav>}
    </div></>;
}

UsersIndex.layout = { breadcrumbs: [{ title: 'Manajemen User', href: '/users' }] };
