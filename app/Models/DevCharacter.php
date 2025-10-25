<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\DevGroup;
class DevCharacter extends Model
{
    use HasFactory;

    protected $fillable = [
        'devgroup_id', 
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
    
    // グループ（DevGroupに変更）
    public function group()
    {
        return $this->belongsTo(DevGroup::class, 'devgroup_id'); // 外部キーを明示
    }
}