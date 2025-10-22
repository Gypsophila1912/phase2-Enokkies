<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DailyMessage;

class DailyMessageSeeder extends Seeder
{
    public function run(): void
    {
        $messages = [
            // 🌱 ここに「今日のひとこと」を自由に追加してください！
            '「好きな色は緑！」',
            '「プログラミング楽しい」',
            '「森の仲間が応援してるよ！」',
            '「タスクをこなして成長しよう！」',
            '「好きな色はみどり！」',
        ];

        foreach ($messages as $msg) {
            DailyMessage::create(['message' => $msg]);
        }
    }
}
