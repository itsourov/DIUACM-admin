<?php

namespace App\Filament\Resources\RankListResource\RelationManagers;

use App\Filament\Resources\EventResource;
use Filament\Forms;
use Filament\Forms\Components\Tabs;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Actions\AttachAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class EventsRelationManager extends RelationManager
{
    protected static string $relationship = 'events';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Tabs::make('Tabs')
                    ->columnSpan(2)
                    ->tabs([
                        Tabs\Tab::make('Aditional Info')
                            ->schema([
                                TextInput::make('weight')
                                    ->numeric()
                                    ->default(1.0)
                                    ->step(0.01)
                                    ->minValue(0.0)
                                    ->maxValue(1.0),
                            ]),
                        Tabs\Tab::make('Event Info')
                            ->schema(EventResource::form($form)->getComponents()),
                    ])
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                TextColumn::make('title')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('weight')->badge()->sortable(),

                TextColumn::make('description')
                    ->toggleable()->toggledHiddenByDefault(),

                TextColumn::make('status'),

                TextColumn::make('starting_at')
                    ->sortable()
                    ->label('Starting Date')
                    ->date(),

                TextColumn::make('ending_at')
                    ->label('Ending Date')
                    ->toggleable()->toggledHiddenByDefault()
                    ->date(),

                TextColumn::make('event_link')
                    ->toggleable()->toggledHiddenByDefault(),

                TextColumn::make('open_for_attendance'),

                TextColumn::make('type'),

                TextColumn::make('attendance_scope'),

            ])
            ->filters([
                //
            ])
            ->headerActions([
                AttachAction::make('attach')
                    ->preloadRecordSelect()
                    ->modalWidth('3xl')
                    ->recordSelectOptionsQuery(fn (Builder $query) => $query->latest('starting_at'))
                    ->recordTitle(function ($record) {
                        return  $record->starting_at->format('d M Y').' || '.$record->title ;
                    })
                    ->multiple()
                    ->form(fn(AttachAction $action): array => [
                        $action->getRecordSelect(),
                        Forms\Components\TextInput::make('weight')
                            ->numeric()
                            ->default(1.0)
                            ->step(0.01)
                            ->minValue(0.0)
                            ->maxValue(1.0)
                            ->required(),
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DetachAction::make(),

            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DetachBulkAction::make(),
                ]),
            ]);
    }
}
