<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\DevGroup;
class DevGroupUser extends Model
{
    use HasFactory;

    protected $table = 'devgroup_user';

    protected $fillable = [
        'devgroup_id',
        'user_id',
        'github_account',
        'personal_points',
    ];

    // 所属ユーザー
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 所属グループ
    public function devGroup()
    {
        return $this->belongsTo(DevGroup::class);
    }
}
