<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('rank_lists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tracker_id')->constrained();
            $table->string('title');
            $table->string('session');
            $table->string('description')->nullable();
            $table->double('weight_of_upsolve')->default(0.25);
            $table->boolean('is_archived')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rank_lists');
    }
};
