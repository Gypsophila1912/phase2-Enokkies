<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('dev_characters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('devgroup_id')->constrained('devgroups')->cascadeOnDelete();
            $table->string('name');
            $table->integer('level')->default(1);
            $table->integer('experience')->default(0);
            $table->integer('affection')->default(0);
            $table->string('image_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dev_characters');
    }
};
