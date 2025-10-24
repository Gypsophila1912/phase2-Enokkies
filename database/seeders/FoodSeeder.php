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
                'name' => 'エノキアイス',
                'price' => 10,
                'image_path' => '/food/ice.png',
                'rarity' => 'common',
            ],
            [
                'name' => 'エノキビスケット',
                'price' => 25,
                'image_path' => '/food/biscuit.png',
                'rarity' => 'common',
            ],
            [
                'name' => 'カツ丼',
                'price' => 60,
                'image_path' => '/food/normal.png',
                'rarity' => 'rare',
            ],
            [
                'name' => 'ステーキ',
                'price' => 90,
                'image_path' => '/food/steak.png',
                'rarity' => 'rare',
            ],
            [
                'name' => 'エノキ天ぷら',
                'price' => 200,
                'image_path' => '/food/tempra.png',
                'rarity' => 'super_rare',
            ],
            [
                'name' => '寿司の盛り合わせ',
                'price' => 500,
                'image_path' => '/food/sushi.png',
                'rarity' => 'super_rare',
            ],
            [
                'name'=>'黄金のエノキ鍋',
                'price'=>1000,
                'image_path'=>'/food/nabe.png',
                'rarity'=>'super_rare',
            ],
            [
                'name' => 'クレープ',
                'price' => 70,
                'image_path' => '/food/crepe.png',
                'rarity' => 'rare',
            ], 
            [
                'name' => '焼肉',
                'price' => 300,
                'image_path' => '/food/meat.png',
                'rarity' => 'super_rare',
            ],
            [
                'name' => 'お好み焼き',
                'price' => 30,
                'image_path' => '/food/okonomiyaki.png',
                'rarity' => 'common',
            ],
            [
                'name' => 'みかん',
                'price' => 20,
                'image_path' => '/food/orange.png',
                'rarity' => 'common',
            ],
            [
                'name' => 'パスタ',
                'price' => 30,
                'image_path' => '/food/pasta.png',
                'rarity' => 'common',
            ],
            [
                'name' => 'ラーメン',
                'price' => 90,
                'image_path' => '/food/ramen.png',
                'rarity' => 'rare',
            ],
            [
                'name' => 'さば定食',
                'price' => 120,
                'image_path' => '/food/saba.png',
                'rarity' => 'rare',
            ],
            [
                'name' => 'ショートケーキ',
                'price' => 400,
                'image_path' => '/food/short.png',
                'rarity' => 'super_rare',
            ],
        ]);
    }
}

