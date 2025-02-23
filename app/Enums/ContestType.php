<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;

enum ContestType: string implements HasColor, HasIcon, HasLabel
{
    case ICPC_REGIONAL = 'icpc_regional';
    case ICPC_ASIA_WEST = 'icpc_asia_west';
    case IUPC = 'iupc';
    case OTHER = 'other';

    public function getColor(): string
    {
        return match ($this) {
            self::ICPC_REGIONAL => 'danger',
            self::ICPC_ASIA_WEST => 'warning',
            self::IUPC => 'info',
            self::OTHER => 'success'
        };
    }

    public function getLabel(): string
    {
        return match ($this) {
            self::ICPC_REGIONAL => 'ICPC Regional',
            self::ICPC_ASIA_WEST => 'ICPC Asia West',
            self::IUPC => 'IUPC',
            self::OTHER => 'Other'
        };
    }

    public function getIcon(): ?string
    {
        return match ($this) {
            self::ICPC_REGIONAL => 'heroicon-o-trophy',
            self::ICPC_ASIA_WEST => 'heroicon-o-globe-asia-australia',
            self::IUPC => 'heroicon-o-academic-cap',
            self::OTHER => 'heroicon-o-question-mark-circle',
        };
    }

    public static function toArray(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}
