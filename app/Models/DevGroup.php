<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DevGroup extends Model
{
    use HasFactory;
    protected $table = 'devgroups';

    protected $fillable = [
        'uuid',
        'name',
        'url',
        'total_points',
        'repository_owner',
        'repository_name',
    ];

    // グループに所属する DevGroupUser レコードとの関係
    public function devGroupUsers()
    {
        return $this->hasMany(DevGroupUser::class, 'devgroup_id');
    }

    // グループに所属するユーザー一覧
    public function users()
    {
        return $this->belongsToMany(User::class, 'devgroup_user', 'devgroup_id', 'user_id');
    }

    // ヘルパーメソッド: GitHub API用のフルパス
    public function getRepositoryFullNameAttribute()
    {
        return "{$this->repository_owner}/{$this->repository_name}";
    }
}
