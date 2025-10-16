<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Groups extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'created_by',
    ];

    //ユーザーテーブル
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    //グループメンバー
    public function members()
    {
        return $this->belongsToMany(User::class, 'groups_users')
                    ->withTimestamps();
    }

    // タスク
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    // キャラクター
    public function characters()
    {
        return $this->hasMany(Character::class);
    }
}
