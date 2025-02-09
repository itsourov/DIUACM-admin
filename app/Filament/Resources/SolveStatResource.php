<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SolveStatResource\Pages;
use App\Models\SolveStat;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Table;

class SolveStatResource extends Resource
{
    protected static ?string $model = SolveStat::class;

    protected static ?string $slug = 'solve-stats';

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required()
                    ->searchable(),

                Select::make('event_id')
                    ->relationship('event', 'title')
                    ->required()
                    ->searchable(),

                TextInput::make('solve_count')
                    ->required()
                    ->integer()
                    ->minValue(0),

                TextInput::make('upsolve_count')
                    ->required()
                    ->integer()
                    ->minValue(0),

                Checkbox::make('is_present')
                    ->default(false),

                Placeholder::make('created_at')
                    ->label('Created Date')
                    ->content(fn(?SolveStat $record): string => $record?->created_at?->diffForHumans() ?? '-'),

                Placeholder::make('updated_at')
                    ->label('Last Modified Date')
                    ->content(fn(?SolveStat $record): string => $record?->updated_at?->diffForHumans() ?? '-'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('event.title')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('solve_count')
                    ->sortable(),

                TextColumn::make('upsolve_count')
                    ->sortable(),

                IconColumn::make('is_present')
                    ->boolean()
                    ->sortable(),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
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
            'index' => Pages\ListSolveStats::route('/'),
            'create' => Pages\CreateSolveStat::route('/create'),
            'edit' => Pages\EditSolveStat::route('/{record}/edit'),
        ];
    }

    public static function getGloballySearchableAttributes(): array
    {
        return [
            'user.name',
            'event.name',
            'solve_count',
            'upsolve_count',
        ];
    }
}
