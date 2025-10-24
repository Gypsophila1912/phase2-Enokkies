<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dressing extends Model
{
    protected $table = 'dressings';
    protected $fillable = [
        'name',
        'price',
        'image_path',
        'rarity',
    ];
}
