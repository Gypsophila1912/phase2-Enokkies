<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupUser extends Model
{
    use HasFactory;

    protected $table = 'groups_users';
    protected $fillable = [
        'group_id',
        'title',
        'description',
        'completed_by',
        'completed_at',
        'points',
    ];

    //グループ
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    //ユーザー
    public function user()
    {
        return $this->belongsTo(User::class, 'completed_by');
    }
}
