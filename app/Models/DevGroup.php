<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
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

    public function devGroupUsers()
    {
        return $this->hasMany(DevGroupUser::class, 'devgroup_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'devgroup_user', 'devgroup_id', 'user_id');
    }

    // キャラクター（外部キーを明示）
    public function character()
    {
        return $this->hasOne(DevCharacter::class, 'devgroup_id');
    }

    public function getRepositoryFullNameAttribute()
    {
        return "{$this->repository_owner}/{$this->repository_name}";
    }
}