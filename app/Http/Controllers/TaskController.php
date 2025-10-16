<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_id',
        'user_id',
        'title',
        'description',
        'completed_at',
        'points',
    ];

    protected $dates = ['completed_at'];

    // ✅ タスク完了状態を切り替える
    public function toggleComplete()
    {
        $this->update([
            'completed_at' => $this->completed_at ? null : now(),
        ]);
    }

    // ✅ リレーション
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}
