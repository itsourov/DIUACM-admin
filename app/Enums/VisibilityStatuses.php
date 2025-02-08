<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;

enum VisibilityStatuses: string implements HasColor, HasIcon, HasLabel
{
    case PUBLISHED = 'published';
    case DRAFT = 'draft';
    case PRIVATE = 'private';

    public function getColor(): string
    {
        return match ($this) {
            self::PUBLISHED => 'success',
            self::DRAFT => 'warning',
            self::PRIVATE => 'danger',
        };
    }

    public function getLabel(): string
    {
        return match ($this) {
            self::PUBLISHED => 'Published',
            self::DRAFT => 'Draft',
            self::PRIVATE => 'Private',
        };
    }

    public function getIcon(): ?string
    {
        return match ($this) {
            self::PUBLISHED => 'heroicon-o-eye',
            self::DRAFT => 'heroicon-o-pencil',
            self::PRIVATE => 'heroicon-o-lock-closed',
        };
    }

    public static function toArray(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}
