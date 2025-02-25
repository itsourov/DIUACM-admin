<?php

use App\Enums\EventAttendanceScopes;
use App\Enums\EventTypes;
use App\Enums\VisibilityStatuses;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description')->nullable();
            $table->enum('status', VisibilityStatuses::toArray())->default(VisibilityStatuses::DRAFT);
            $table->dateTime('starting_at');
            $table->dateTime('ending_at');
            $table->string('event_link')->nullable()->unique();
            $table->string('event_password')->nullable();
            $table->boolean('open_for_attendance');
            $table->boolean('strict_attendance')->default(false);
            $table->enum('type', EventTypes::toArray())->default(EventTypes::CONTEST);
            $table->enum('attendance_scope', EventAttendanceScopes::toArray())->default(EventAttendanceScopes::OPEN_FOR_ALL);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
