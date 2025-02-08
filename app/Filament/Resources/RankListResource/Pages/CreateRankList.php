<?php

namespace App\Filament\Resources\RankListResource\Pages;

use App\Filament\Resources\RankListResource;
use Filament\Resources\Pages\CreateRecord;

class CreateRankList extends CreateRecord
{
    protected static string $resource = RankListResource::class;

    protected function getHeaderActions(): array
    {
        return [

        ];
    }
}
