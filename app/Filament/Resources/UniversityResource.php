<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UniversityResource\Pages;
use App\Models\University;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables\Actions\ActionGroup;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Collection;

class UniversityResource extends Resource
{
    protected static ?string $model = University::class;
    protected static ?string $slug = 'universities';
    protected static ?string $navigationIcon = 'heroicon-o-academic-cap';
    protected static ?string $recordTitleAttribute = 'name';
    protected static ?string $navigationGroup = 'Contest History Management';
    protected static ?int $navigationSort = 1;

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('University Details')
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->minLength(3)
                            ->maxLength(255)
                            ->placeholder('Enter university name')
                            ->columnSpanFull(),

                        Grid::make(2)
                            ->schema([
                                TextInput::make('city')
                                    ->required()
                                    ->maxLength(100)
                                    ->placeholder('Enter city name'),

                                TextInput::make('address')
                                    ->maxLength(255)
                                    ->placeholder('Enter full address'),
                            ]),
                    ]),

                Section::make('Timestamps')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                Placeholder::make('created_at')
                                    ->label('Created Date')
                                    ->content(fn(?University $record): string => $record?->created_at?->diffForHumans() ?? '-'),

                                Placeholder::make('updated_at')
                                    ->label('Last Modified Date')
                                    ->content(fn(?University $record): string => $record?->updated_at?->diffForHumans() ?? '-'),
                            ]),
                    ])
                    ->collapsed(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('city')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('address')
                    ->searchable()
                    ->wrap()
                    ->toggleable(),

                TextColumn::make('contests_count')
                    ->counts('contests')
                    ->sortable()
                    ->badge(),
            ])
            ->defaultSort('name')
            ->filters([
                // Add filters if needed
            ])
            ->actions([
                ViewAction::make(),
                EditAction::make(),
                ActionGroup::make([
                    DeleteAction::make()
                        ->label('Safe Delete')
                        ->before(function (DeleteAction $action, University $university) {
                            if ($university->contests()->exists()) {
                                Notification::make()
                                    ->danger()
                                    ->title('Failed to delete!')
                                    ->body('University has contests. Use force delete to remove the university and its contests.')
                                    ->persistent()
                                    ->send();

                                $action->cancel();
                            }
                        }),
                    DeleteAction::make('forceDelete')
                        ->label('Delete with Contests')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->modalDescription('This will permanently delete the university and all associated contests with their teams.')
                        ->action(function (University $record) {
                            $record->contests->each(function ($contest) {
                                $contest->teams()->delete();
                                $contest->delete();
                            });
                            $record->delete();
                        }),
                ]),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()
                        ->before(function (DeleteBulkAction $action, Collection $records) {
                            foreach ($records as $university) {
                                if ($university->contests()->exists()) {
                                    Notification::make()
                                        ->danger()
                                        ->title('Failed to delete!')
                                        ->body('One or more universities have associated contests. Use force delete to remove universities and their contests.')
                                        ->persistent()
                                        ->send();

                                    $action->cancel();
                                }
                            }
                        }),
                    DeleteBulkAction::make('forceBulkDelete')
                        ->label('Delete with Contests')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->modalDescription('This will permanently delete the selected universities and all their associated contests with teams.')
                        ->action(function (Collection $records) {
                            $records->each(function ($university) {
                                $university->contests->each(function ($contest) {
                                    $contest->teams()->delete();
                                    $contest->delete();
                                });
                                $university->delete();
                            });
                        }),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUniversities::route('/'),
            'create' => Pages\CreateUniversity::route('/create'),
            'edit' => Pages\EditUniversity::route('/{record}/edit'),
        ];
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['name', 'city', 'address'];
    }
}
