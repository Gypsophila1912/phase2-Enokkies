<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;


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

