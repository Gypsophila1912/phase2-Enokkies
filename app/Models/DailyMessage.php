<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyMessage extends Model
{
    // テーブル名（Laravelの命名規則に従っていれば省略可能）
    protected $table = 'daily_messages';

    // 書き換え可能なカラム
    protected $fillable = ['message'];
}
