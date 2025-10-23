<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DressingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('dressings')->insert([
                        [
                'name' => 'ベビエノっキー',
                'price' => 250,
                'image_path' => './Eno/baby.png',
                'rarity' => 'super_rare',
            ],
            [
                'name' => 'エンジニアエノっキー',
                'price' => 250,
                'image_path' => './Eno/en.png',
                'rarity' => 'rare',
            ],
            
            [
                'name' => 'パンプキンエノッキー',
                'price' => 300,
                'image_path' => './Eno/pumpkin.png',
                'rarity' => 'super_rare',
            ],
            [
                'name' => 'サイヤエノッキー',
                'price' => 500,
                'image_path' => './Eno/saiya.png',
                'rarity' => 'super_rare',
            ],
            // 必要に応じて追加
        ]);
    }
}
