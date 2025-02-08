<?php

namespace App\Filament\Resources\RankListResource\Pages;

use App\Filament\Resources\RankListResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditRankList extends EditRecord
{
    protected static string $resource = RankListResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
