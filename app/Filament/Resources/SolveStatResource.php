<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SolveStatResource\Pages;
use App\Models\SolveStat;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
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
                Forms\Components\Section::make('Participant Information')
                    ->description('Select the participant and event details')
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\Select::make('user_id')
                                    ->relationship('user', 'name')
                                    ->required()
                                    ->searchable()
                                    ->preload()
                                    ->createOptionForm([
                                        Forms\Components\TextInput::make('name')
                                            ->required(),
                                        Forms\Components\TextInput::make('email')
                                            ->required()
                                            ->email(),
                                    ])
                                    ->label('Participant'),

                                Forms\Components\Select::make('event_id')
                                    ->relationship('event', 'title')
                                    ->required()
                                    ->searchable()
                                    ->preload()
                                    ->label('Contest/Event'),
                            ]),
                    ]),

                Forms\Components\Section::make('Performance Metrics')
                    ->description('Enter the solving statistics')
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\TextInput::make('solve_count')
                                    ->required()
                                    ->integer()
                                    ->minValue(0)
                                    ->maxValue(999)
                                    ->step(1)
                                    ->suffix('problems')
                                    ->hint('Number of problems solved during contest')
                                    ->label('Contest Solves'),

                                Forms\Components\TextInput::make('upsolve_count')
                                    ->required()
                                    ->integer()
                                    ->minValue(0)
                                    ->maxValue(999)
                                    ->step(1)
                                    ->suffix('problems')
                                    ->hint('Number of problems solved after contest')
                                    ->label('Upsolving Count'),
                            ]),
                    ]),

                Forms\Components\Section::make('Additional Details')
                    ->schema([
                        Forms\Components\Checkbox::make('is_present')
                            ->default(false)
                            ->inline(false)
                            ->label('Was Present?')
                            ->helperText('Check if the participant attended the event'),

                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\Placeholder::make('created_at')
                                    ->label('Created Date')
                                    ->content(fn(?SolveStat $record): string => $record?->created_at?->diffForHumans() ?? '-'),

                                Forms\Components\Placeholder::make('updated_at')
                                    ->label('Last Modified')
                                    ->content(fn(?SolveStat $record): string => $record?->updated_at?->diffForHumans() ?? '-'),
                            ]),
                    ])
                    ->collapsible(),
            ])
            ->columns(1);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('event.title')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('solve_count')
                    ->sortable(),

                Tables\Columns\TextColumn::make('upsolve_count')
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_present')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
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

        ];
    }
}
