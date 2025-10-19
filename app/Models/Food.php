<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Food extends Model
{
    use HasFactory;

    protected $table = 'foods'; // 

    protected $fillable = [
        'name',
        'price',
        'image_path',
        'rarity',
    ];
    // ご飯とグループの多対多リレーション
    public function groups()
    {
    return $this->belongsToMany(Group::class, 'group_foods')->withPivot('quantity')->withTimestamps();
    }
}