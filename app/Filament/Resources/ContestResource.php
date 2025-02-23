<?php

namespace App\Filament\Resources;

use App\Enums\ContestType;
use App\Enums\EventTypes;
use App\Filament\Resources\ContestResource\Pages;
use App\Models\Contest;
use App\Models\University;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables\Actions\ActionGroup;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Actions\CreateAction;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class ContestResource extends Resource
{
    protected static ?string $model = Contest::class;
    protected static ?string $slug = 'contests';
    protected static ?string $navigationIcon = 'heroicon-o-trophy';
    protected static ?string $recordTitleAttribute = 'name';
    protected static ?string $navigationGroup = 'Contest History Management';

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Basic Information')
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),

                        Select::make('type')
                            ->enum(ContestType::class)
                            ->options(ContestType::class)
                            ->required(),

                        DateTimePicker::make('date')
                            ->seconds(false)
                            ->default(today())
                            ->timezone('Asia/Dhaka')
                            ->required(),
                    ])
                    ->columns(2),

                Section::make('Location')
                    ->schema([
                        Select::make('university_id')
                            ->relationship('university', 'name')
                            ->createOptionModalHeading('Create University')
                            ->createOptionForm(UniversityResource::form($form)->getComponents())
                            ->required()
                            ->preload()
                            ->searchable(),
                    ]),

                Section::make('Additional Details')
                    ->schema([
                        Textarea::make('description')
                            ->maxLength(65535)
                            ->columnSpanFull(),
                    ]),

                Section::make('Metadata')
                    ->schema([
                        Placeholder::make('created_at')
                            ->label('Created Date')
                            ->content(fn(?Contest $record): string => $record?->created_at?->diffForHumans() ?? '-'),

                        Placeholder::make('updated_at')
                            ->label('Last Modified Date')
                            ->content(fn(?Contest $record): string => $record?->updated_at?->diffForHumans() ?? '-'),
                    ])
                    ->columns(2)
                    ->collapsed(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('date', 'desc')
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->description(fn(Contest $record): string => $record->description ?? '')
                    ->wrap(),

                TextColumn::make('date')
                    ->sortable()
                    ->dateTime('M j, Y g:i A')
                    ->badge()
                    ->color(fn(Contest $record) => $record->date->isPast() ? 'danger' :
                        ($record->date->isToday() ? 'warning' : 'success')
                    ),

                TextColumn::make('university.name')
                    ->searchable()
                    ->sortable()
                    ->badge(),

                TextColumn::make('teams_count')
                    ->sortable()
                    ->counts('teams')
                    ->badge(),

                TextColumn::make('type')
                    ->badge()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('type')
                    ->options(ContestType::class)
                    ->multiple(),

                SelectFilter::make('university')
                    ->relationship('university', 'name'),

                Filter::make('upcoming')
                    ->query(fn(Builder $query): Builder => $query->where('date', '>=', now()))
                    ->toggle(),

                Filter::make('past')
                    ->query(fn(Builder $query): Builder => $query->where('date', '<', now()))
                    ->toggle(),
            ])
            ->actions([
                ViewAction::make(),
                EditAction::make(),
                ActionGroup::make([
                    DeleteAction::make()
                        ->label('Safe Delete')
                        ->before(function (DeleteAction $action, Contest $contest) {
                            if ($contest->teams()->exists()) {
                                Notification::make()
                                    ->danger()
                                    ->title('Failed to delete!')
                                    ->body('Contest has teams. Use force delete to remove the contest and its teams.')
                                    ->persistent()
                                    ->send();

                                $action->cancel();
                            }
                        }),
                    DeleteAction::make('forceDelete')
                        ->label('Delete with Teams')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->modalDescription('This will permanently delete the contest and all associated teams.')
                        ->action(function (Contest $record) {
                            $record->teams()->delete();
                            $record->delete();
                        }),
                ]),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()
                        ->before(function (DeleteBulkAction $action, Collection $records) {
                            foreach ($records as $contest) {
                                if ($contest->teams()->exists()) {
                                    Notification::make()
                                        ->danger()
                                        ->title('Failed to delete!')
                                        ->body('One or more contests have associated teams. Use force delete to remove contests and their teams.')
                                        ->persistent()
                                        ->send();

                                    $action->cancel();
                                }
                            }
                        }),
                    DeleteBulkAction::make('forceBulkDelete')
                        ->label('Delete with Teams')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->modalDescription('This will permanently delete the selected contests and all their associated teams.')
                        ->action(function (Collection $records) {
                            $records->each(function ($contest) {
                                $contest->teams()->delete();
                                $contest->delete();
                            });
                        }),
                ]),
            ])
            ->emptyStateIcon('heroicon-o-trophy')
            ->emptyStateHeading('No Contests Yet')
            ->emptyStateDescription('Create your first contest to get started.')
            ->emptyStateActions([
                CreateAction::make()
                    ->label('Create Contest'),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListContests::route('/'),
            'create' => Pages\CreateContest::route('/create'),
            'edit' => Pages\EditContest::route('/{record}/edit'),
        ];
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['name', 'description', 'university.name'];
    }

    public static function getGlobalSearchResultDetails($record): array
    {
        return [
            'University' => $record->university->name,
            'Date' => $record->date->format('M j, Y g:i A'),
            'Type' => $record->type->getLabel(),
        ];
    }
}
