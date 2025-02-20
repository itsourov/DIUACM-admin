<?php

namespace App\Filament\Resources\EventResource\RelationManagers;

use App\Filament\Resources\RankListResource;
use Filament\Forms;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\Tabs;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Actions\AttachAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class RankListsRelationManager extends RelationManager
{
    protected static string $relationship = 'rankLists';

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

                                Checkbox::make('strict_attendance')
                                    ->label('Strict Attendance')
                                    ->helperText('If enabled then the users who didn\'t gave attendance their solve count wont be counted.'),
                            ]),
                        Tabs\Tab::make('Event Info')
                            ->schema(RankListResource::form($form)->getComponents()),
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
                Tables\Columns\ToggleColumn::make('strict_attendance')
                    ->sortable(),
                TextColumn::make('session')->badge(),

            ])
            ->filters([
                //
            ])
            ->headerActions([
                AttachAction::make('attach')
                    ->preloadRecordSelect()
                    ->recordSelectSearchColumns(['title'])
                    ->modalWidth('3xl')
                    ->recordTitle(function ($record) {
                        return $record->title . ' || ' . $record->session;
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
                        Checkbox::make('strict_attendance')
                            ->label('Strict Attendance')
                            ->helperText('If enabled then the users who didn\'t gave attendance their solve count wont be counted.'),


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
