<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Group;

class Character extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_id',
        'name',
        'level',
        'experience',
        'image_path',
        'affection', 
    ];


    protected $appends = ['image_url'];
    
    public function getImageUrlAttribute()
    {
        return asset($this->image_path);
    }
    //グループ
    public function group()
    {
        return $this->belongsTo(Group::class);
    }
    
}
