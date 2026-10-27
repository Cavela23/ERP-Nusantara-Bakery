<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use RuntimeException;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $password = env('ADMIN_PASSWORD');

        if (blank($password)) {
            throw new RuntimeException('ADMIN_PASSWORD wajib diatur sebelum menjalankan seeder.');
        }

        $admin = User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'fauziannrachman@gmail.com')],
            [
                'name' => env('ADMIN_NAME', 'Administrator'),
                'password' => $password,
                'email_verified_at' => now(),
            ],
        );

        $admin->syncRoles(['owner']);
    }
}
