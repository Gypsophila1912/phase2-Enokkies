<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('group_foods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained()->onDelete('cascade');
            $table->foreignId('food_id')->constrained()->onDelete('cascade');
            $table->integer('quantity')->default(0);
            $table->timestamps();

            $table->unique(['group_id', 'food_id']); // グループごとに食べ物の一意制約
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('group_foods');
    }
};