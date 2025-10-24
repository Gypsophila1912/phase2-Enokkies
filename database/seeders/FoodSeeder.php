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
                'exp_points' => 5,
            ],
            [
                'name' => 'エノキビスケット',
                'price' => 25,
                'image_path' => '/food/biscuit.png',
                'rarity' => 'common',
                'exp_points' => 5,
            ],
            [
                'name' => 'カツ丼',
                'price' => 60,
                'image_path' => '/food/normal.png',
                'rarity' => 'rare',
                'exp_points' => 10,
            ],
            [
                'name' => 'ステーキ',
                'price' => 90,
                'image_path' => '/food/steak.png',
                'rarity' => 'rare',
                'exp_points' => 10,
            ],
            [
                'name' => 'エノキ天ぷら',
                'price' => 200,
                'image_path' => '/food/tempra.png',
                'rarity' => 'super_rare',
                'exp_points' => 20,
            ],
            [
                'name' => '寿司の盛り合わせ',
                'price' => 500,
                'image_path' => '/food/sushi.png',
                'rarity' => 'super_rare',
                'exp_points' => 20,
            ],
            [
                'name'=>'黄金のエノキ鍋',
                'price'=>1000,
                'image_path'=>'/food/nabe.png',
                'rarity'=>'super_rare',
                'exp_points' => 20,
            ],
            [
                'name' => 'クレープ',
                'price' => 70,
                'image_path' => '/food/crepe.png',
                'rarity' => 'rare',
                'exp_points' => 10,
            ], 
            [
                'name' => '焼肉',
                'price' => 300,
                'image_path' => '/food/meat.png',
                'rarity' => 'super_rare',
                'exp_points' => 20,
            ],
            [
                'name' => 'お好み焼き',
                'price' => 30,
                'image_path' => '/food/okonomiyaki.png',
                'rarity' => 'common',
                'exp_points' => 5,
            ],
            [
                'name' => 'みかん',
                'price' => 20,
                'image_path' => '/food/orange.png',
                'rarity' => 'common',
                'exp_points' => 5,
            ],
            [
                'name' => 'パスタ',
                'price' => 30,
                'image_path' => '/food/pasta.png',
                'rarity' => 'common',
                'exp_points' => 5,
            ],
            [
                'name' => 'ラーメン',
                'price' => 90,
                'image_path' => '/food/ramen.png',
                'rarity' => 'rare',
                'exp_points' => 10,
            ],
            [
                'name' => 'さば定食',
                'price' => 120,
                'image_path' => '/food/Saba.png',
                'rarity' => 'rare',
                'exp_points' => 10,
            ],
            [
                'name' => 'ショートケーキ',
                'price' => 400,
                'image_path' => '/food/short.png',
                'rarity' => 'super_rare',
                'exp_points' => 20,
            ],
        ]);
    }
}

