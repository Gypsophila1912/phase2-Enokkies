<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /*
Run the migrations.
     */
    public function up(): void
    {
        Schema::create('group_foods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained()->onDelete('cascade');
            $table->foreignId('food_id')->constrained('foods')->onDelete('cascade');
            $table->integer('quantity')->default(0);
            $table->enum('rarity', ['common', 'rare', 'super_rare'])->default('common')->comment('Food rarity'); // 追加
            $table->timestamps();
            $table->unique(['group_id', 'food_id']);
        });
    }

    /*
Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_foods');
    }
};