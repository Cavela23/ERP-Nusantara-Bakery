<?php

namespace Database\Factories;

use App\Models\RawMaterial;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RawMaterial>
 */
class RawMaterialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //
            'name' => fake()->randomElement([
                'Tepung Terigu', 'Gula Pasir', 'Telur', 'Mentega',
                'Ragi Instan', 'Susu Cair', 'Coklat Bubuk', 'Keju Cheddar',
                'Garam', 'Baking Powder', 'Vanili', 'Minyak Goreng',
            ]),
            'sku' => fake()->unique()->bothify('RM-#####'),
            'unit' => fake()->randomElement(['kg', 'liter', 'pcs']),
            'price' => fake()->randomFloat(2, 5000, 100000),
            'stock_min' => fake()->randomFloat(3, 5, 50),
        ];
    }
}
