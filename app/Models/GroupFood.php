<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupFood extends Model
{
    use HasFactory;

    protected $table = 'group_foods';

    protected $fillable = [
        'group_id',
        'food_id',
        'quantity',
    ];

    // グループとのリレーション
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    // ご飯とのリレーション
    public function food()
    {
        return $this->belongsTo(Food::class);
    }
}