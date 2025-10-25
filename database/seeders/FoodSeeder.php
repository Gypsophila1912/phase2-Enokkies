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
                'price' => 3,
                'image_path' => '/food/ice.png',
                'rarity' => 'common',
                'exp_points' => 5,
            ],
            [
                'name' => 'エノキビスケット',
                'price' => 5,
                'image_path' => '/food/biscuit.png',
                'rarity' => 'common',
                'exp_points' => 5,
            ],
            [
                'name' => 'カツ丼',
                'price' => 10,
                'image_path' => '/food/normal.png',
                'rarity' => 'rare',
                'exp_points' => 10,
            ],
            [
                'name' => 'ステーキ',
                'price' => 12,
                'image_path' => '/food/steak.png',
                'rarity' => 'rare',
                'exp_points' => 10,
            ],
            [
                'name' => 'エノキ天ぷら',
                'price' => 15,
                'image_path' => '/food/tempra.png',
                'rarity' => 'super_rare',
                'exp_points' => 20,
            ],
            [
                'name' => '寿司の盛り合わせ',
                'price' => 15,
                'image_path' => '/food/sushi.png',
                'rarity' => 'super_rare',
                'exp_points' => 20,
            ],
            [
                'name'=>'黄金のエノキ鍋',
                'price'=>15,
                'image_path'=>'/food/nabe.png',
                'rarity'=>'super_rare',
                'exp_points' => 20,
            ],
            [
                'name' => 'クレープ',
                'price' => 10,
                'image_path' => '/food/crepe.png',
                'rarity' => 'rare',
                'exp_points' => 10,
            ], 
            [
                'name' => '焼肉',
                'price' => 20,
                'image_path' => '/food/meat.png',
                'rarity' => 'super_rare',
                'exp_points' => 20,
            ],
            [
                'name' => 'お好み焼き',
                'price' => 5,
                'image_path' => '/food/okonomiyaki.png',
                'rarity' => 'common',
                'exp_points' => 5,
            ],
            [
                'name' => 'みかん',
                'price' => 3,
                'image_path' => '/food/orange.png',
                'rarity' => 'common',
                'exp_points' => 5,
            ],
            [
                'name' => 'パスタ',
                'price' => 7,
                'image_path' => '/food/pasta.png',
                'rarity' => 'common',
                'exp_points' => 5,
            ],
            [
                'name' => 'ラーメン',
                'price' => 12,
                'image_path' => '/food/ramen.png',
                'rarity' => 'rare',
                'exp_points' => 10,
            ],
            [
                'name' => 'さば定食',
                'price' => 12,
                'image_path' => '/food/Saba.png',
                'rarity' => 'rare',
                'exp_points' => 10,
            ],
            [
                'name' => 'ショートケーキ',
                'price' => 20,
                'image_path' => '/food/short.png',
                'rarity' => 'super_rare',
                'exp_points' => 20,
            ],
        ]);
    }
}

