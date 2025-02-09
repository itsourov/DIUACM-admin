<?php

namespace App\Filament\Resources\SolveStatResource\Pages;

use App\Filament\Resources\SolveStatResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSolveStats extends ListRecords
{
    protected static string $resource = SolveStatResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
