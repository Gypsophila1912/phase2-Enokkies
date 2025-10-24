<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Dressing;

class DressingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Dressing::insert([
            [
                'name' => 'ベビエノっキー',
                'price' => 250,
                'image_path' => '/dressings/baby.png',
                'rarity' => 'super_rare',
            ],
            [
                'name' => 'エンジニアエノっキー',
                'price' => 250,
                'image_path' => '/dressings/en.png',
                'rarity' => 'rare',
            ],
            
            [
                'name' => 'パンプキンエノッキー',
                'price' => 300,
                'image_path' => '/dressings/pumpkin.png',
                'rarity' => 'super_rare',
            ],
            [
                'name' => 'サイヤエノッキー',
                'price' => 500,
                'image_path' => '/dressings/saiya.png',
                'rarity' => 'super_rare',
            ],
            // 必要に応じて追加
        ]);
    }
}
