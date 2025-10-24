<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('groups', function (Blueprint $table) {
            $table->dropForeign(['created_by']); // 既存の外部キーを削除
            $table->unsignedBigInteger('created_by')->nullable()->change(); // nullを許可
            $table->foreign('created_by')
                ->references('id')->on('users')
                ->onDelete('set null'); // 削除時にnullにする
        });
    }

    public function down()
    {
        Schema::table('groups', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->unsignedBigInteger('created_by')->nullable(false)->change();
            $table->foreign('created_by')
                ->references('id')->on('users')
                ->onDelete('restrict');
        });
    }
};
