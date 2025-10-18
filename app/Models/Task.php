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
        'points',
        'due_date',
        'completed_at',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'completed_at' => 'datetime',
    ];

    //グループ
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    //ユーザー
    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
