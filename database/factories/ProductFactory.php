<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement([
                'Roti Coklat', 'Roti Keju', 'Croissant', 'Donat Glaze', 'Roti Tawar', 'Cookies', 'Cake Coklat',
            ]),
            'category_id' => \App\Models\Category::factory(),
            'sku' => fake()->unique()->bothify('SKU-#####'),
            'price' => fake()->randomFloat(2, 1000, 50000),
            'unit' => 'pcs',
            'stock_min' => fake()->randomFloat(3, 0, 10),
        ];
    }
}
