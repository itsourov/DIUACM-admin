<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;

enum EventAttendanceScopes: string implements HasColor, HasIcon, HasLabel
{
    case OPEN_FOR_ALL = 'open_for_all';
    case ONLY_GIRLS = 'only_girls';
    case JUNIOR_PROGRAMMERS = 'junior_programmers';
    case SELECTED_PERSONS = 'selected_persons';

    public function getColor(): string
    {
        return match ($this) {
            self::OPEN_FOR_ALL => 'success',
            self::ONLY_GIRLS => 'danger',
            self::JUNIOR_PROGRAMMERS => 'primary',
            self::SELECTED_PERSONS => 'warning',
        };
    }

    public function getLabel(): string
    {
        return match ($this) {
            self::OPEN_FOR_ALL => 'Open for All',
            self::ONLY_GIRLS => 'Only Girls',
            self::JUNIOR_PROGRAMMERS => 'Junior Programmers',
            self::SELECTED_PERSONS => 'Selected Persons',
        };
    }

    public function getIcon(): ?string
    {
        return match ($this) {
            self::OPEN_FOR_ALL => 'heroicon-o-globe-alt',
            self::ONLY_GIRLS => 'heroicon-o-user-group',
            self::JUNIOR_PROGRAMMERS => 'heroicon-o-code-bracket',
            self::SELECTED_PERSONS => 'heroicon-o-check-circle',
        };
    }

    public static function toArray(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}
