<?php

namespace App\Filament\Resources\SolveStatResource\Pages;

use App\Filament\Resources\SolveStatResource;
use Filament\Resources\Pages\CreateRecord;

class CreateSolveStat extends CreateRecord
{
    protected static string $resource = SolveStatResource::class;

    protected function getHeaderActions(): array
    {
        return [

        ];
    }
}
