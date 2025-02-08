<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RankListResource\Pages;
use App\Models\RankList;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class RankListResource extends Resource
{
    protected static ?string $model = RankList::class;

    protected static ?string $slug = 'rank-lists';

    protected static ?string $navigationIcon = 'heroicon-o-list-bullet';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Basic Information')
                    ->description('Enter the main details for the ranklist.')
                    ->schema([
                        TextInput::make('title')
                            ->required()
                            ->label('Ranklist Title')
                            ->placeholder('Enter the title')
                            ->helperText('A descriptive title for the ranklist')
                            ->maxLength(255)
                            ->columnSpan('full'),

                        TextInput::make('session')
                            ->required()
                            ->label('Session')
                            ->placeholder('Enter the session')
                            ->helperText('Specify the session for this ranklist')
                            ->columnSpan('full'),

                        Textarea::make('description')
                            ->label('Description')
                            ->placeholder('Enter a description')
                            ->helperText('Optional: Provide additional details about this ranklist')
                            ->maxLength(1000)
                            ->columnSpan('full'),
                    ])->columns(1),

                Section::make('Timestamps')
                    ->description('System-generated timestamps')
                    ->schema([
                        Grid::make()
                            ->schema([
                                Placeholder::make('created_at')
                                    ->label('Created Date')
                                    ->content(fn(?RankList $record): string => $record?->created_at?->diffForHumans() ?? '-'),

                                Placeholder::make('updated_at')
                                    ->label('Last Modified Date')
                                    ->content(fn(?RankList $record): string => $record?->updated_at?->diffForHumans() ?? '-'),
                            ]),
                    ])->collapsed(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('session'),

                TextColumn::make('description'),
            ])
            ->filters([
                //
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListRankLists::route('/'),
            'create' => Pages\CreateRankList::route('/create'),
            'edit' => Pages\EditRankList::route('/{record}/edit'),
        ];
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['title'];
    }
}
