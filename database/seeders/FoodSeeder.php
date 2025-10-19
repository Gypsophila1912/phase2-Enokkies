<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Food;

class FoodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Food::insert([
            [
                'name' => 'エノッキーごはん',
                'price' => 10,
                'image_path' => '/images/foods/rice.png',
                'rarity' => 'common',
            ],
            [
                'name' => 'きのこバーガー',
                'price' => 25,
                'image_path' => '/images/foods/burger.png',
                'rarity' => 'common',
            ],
            [
                'name' => 'エノッキーラーメン',
                'price' => 60,
                'image_path' => '/images/foods/ramen.png',
                'rarity' => 'rare',
            ],
            [
                'name' => 'きのこステーキ',
                'price' => 90,
                'image_path' => '/images/foods/steak.png',
                'rarity' => 'rare',
            ],
            [
                'name' => '高級トリュフ',
                'price' => 150,
                'image_path' => '/images/foods/truffle.png',
                'rarity' => 'super_rare',
            ],
            [
                'name' => '黄金エノキ天ぷら',
                'price' => 200,
                'image_path' => '/images/foods/tempura.png',
                'rarity' => 'super_rare',
            ],
        ]);
    }
}
