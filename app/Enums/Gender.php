<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;

enum Gender: string implements HasColor, HasIcon, HasLabel
{
    case MALE = 'male';
    case FEMALE = 'female';
    case OTHER = 'other';
    case UNSPECIFIED = 'unspecified';

    public function getColor(): string
    {
        return match ($this) {
            self::MALE => 'info',
            self::FEMALE => 'success',
            self::OTHER => 'gray',
            self::UNSPECIFIED => 'gray',
        };
    }

    public function getLabel(): string
    {
        return match ($this) {
            self::MALE => 'Male',
            self::FEMALE => 'Female',
            self::OTHER => 'Other',
            self::UNSPECIFIED => 'Unspecified',
        };
    }

    public function getIcon(): ?string
    {
        return match ($this) {
            self::MALE, self::FEMALE, self::OTHER, self::UNSPECIFIED => 'heroicon-o-user',
        };
    }

    public static function toArray(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}
