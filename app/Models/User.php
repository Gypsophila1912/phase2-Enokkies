<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    /**
     * 所属グループとの関係（1人のユーザーは1つのグループに所属）
     */
    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id');
    }
    
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    // 自分が所属する DevGroupUser レコードとの関係
    public function devGroupUsers()
    {
        return $this->hasMany(DevGroupUser::class);
    }

    // 所属しているグループ一覧を取得
    public function devGroups()
    {
        return $this->belongsToMany(DevGroup::class, 'devgroup_user', 'user_id', 'devgroup_id');
    }
}
