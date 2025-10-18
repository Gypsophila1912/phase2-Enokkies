<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Character;

class Group extends Model
{
    protected $table = 'groups';

    protected $fillable = [
        'name',
        'description',
        'created_by',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'group_id');
    }

    public function members()
    {
        return $this->belongsToMany(User::class);
    }

    public function character()
    {
        return $this->hasOne(Character::class, 'group_id');
    }
}
