<?php

namespace App\Filament\Resources\RankListResource\Pages;

use App\Filament\Resources\RankListResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditRankList extends EditRecord
{
    protected static string $resource = RankListResource::class;

    public function getTitle(): string
    {
        return parent::getTitle(). ' - '. $this->record->title;
    }

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
    public function hasCombinedRelationManagerTabsWithContent(): bool
    {
        return true;
    }
    public function getContentTabIcon(): ?string
    {
        return 'heroicon-m-cog';
    }

}
