<?php

namespace App\Filament\Resources\SolveStatResource\Pages;

use App\Filament\Resources\SolveStatResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSolveStat extends EditRecord
{
    protected static string $resource = SolveStatResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
