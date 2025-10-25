<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\DevGroup;

class DevGroupFood extends Model
{
    use HasFactory;

    protected $table = 'dev_group_food';

    protected $fillable = [
        'devgroup_id',
        'food_id',
        'quantity',
        'rarity',
    ];

    // グループとのリレーション
    public function group()
    {
        return $this->belongsTo(DevGroup::class);
    }

    // ご飯とのリレーション
    public function food()
    {
        return $this->belongsTo(Food::class);
    }
}