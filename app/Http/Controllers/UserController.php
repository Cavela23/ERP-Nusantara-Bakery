<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('users/index', [
            'users' => User::with(['roles', 'branch'])->latest()->paginate(15),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('users/create', [
            'roles' => Role::query()->orderBy('name')->pluck('name'),
            'branches' => Branch::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', Rule::exists('roles', 'name')],
            'branch_id' => ['nullable', 'integer', Rule::exists('branches', 'id')],
        ]);

        $role = $validated['role'];
        unset($validated['role']);
        $user = User::create($validated);
        $user->assignRole($role);

        return to_route('users.index')->with('success', 'Akun berhasil dibuat.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('users/edit', [
            'user' => $user->load(['roles', 'branch']),
            'roles' => Role::query()->orderBy('name')->pluck('name'),
            'branches' => Branch::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'role' => ['required', Rule::exists('roles', 'name')],
            'branch_id' => ['nullable', 'integer', Rule::exists('branches', 'id')],
        ]);

        if ($user->is($request->user()) && $validated['role'] !== 'owner') {
            return back()->withErrors(['role' => 'Akun admin yang sedang digunakan tidak boleh kehilangan role owner.']);
        }

        if (blank($validated['password'])) {
            unset($validated['password']);
        }

        $role = $validated['role'];
        unset($validated['role']);
        $user->update($validated);
        $user->syncRoles([$role]);

        return to_route('users.index')->with('success', 'Akun berhasil diperbarui.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->is($request->user())) {
            return back()->withErrors(['user' => 'Anda tidak dapat menghapus akun yang sedang digunakan.']);
        }

        $user->delete();

        return to_route('users.index')->with('success', 'Akun berhasil dihapus.');
    }
}
