<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TeamResource\Pages;
use App\Models\Team;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\HtmlString;

class TeamResource extends Resource
{
    protected static ?string $model = Team::class;
    protected static ?string $slug = 'teams';
    protected static ?string $navigationIcon = 'heroicon-o-user-group';
    protected static ?string $recordTitleAttribute = 'name';
    protected static ?string $navigationGroup = 'Contest History Management';
    protected static ?int $navigationSort = 2;

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
                            ->unique(ignoreRecord: true)
                            ->minLength(3)
                            ->maxLength(255)
                            ->placeholder('Enter team name')
                            ->columnSpanFull(),

                        Select::make('contest_id')
                            ->relationship('contest', 'name')
                            ->preload()
                            ->searchable()
                            ->required()
                            ->createOptionModalHeading('Create Contest')
                            ->createOptionForm(ContestResource::form($form)->getComponents()),

                        Select::make('coach_id')
                            ->allowHtml()
                            ->relationship('coach', 'name')
                            ->getOptionLabelFromRecordUsing(fn(Model $record) => new HtmlString("{$record->name} <span class='text-gray-500'>({$record->email})</span>"))
                            ->preload()
                            ->searchable(['name', 'email', 'student_id', 'username'])
                            ->required(),
                    ])
                    ->columns(2),

                Section::make('Performance')
                    ->schema([
                        TextInput::make('rank')
                            ->numeric()
                            ->minValue(1)
                            ->required()
                            ->integer()
                            ->placeholder('Team rank in contest'),

                        TextInput::make('solve_count')
                            ->numeric()
                            ->minValue(0)
                            ->required()
                            ->integer()
                            ->placeholder('Number of problems solved'),
                    ])
                    ->columns(2),

                Section::make('Team Members')
                    ->schema([
                        Select::make('members')
                            ->relationship('members', 'name')
                            ->preload()
                            ->multiple()
                            ->getOptionLabelFromRecordUsing(fn(Model $record) => new HtmlString("{$record->name} <span class='text-gray-500'>({$record->student_id})</span>"))
                            ->searchable(['name', 'email', 'student_id', 'username'])
                            ->required()
                            ->allowHtml()
                            ->minItems(1)
                            ->maxItems(3)
                            ->columnSpanFull(),
                    ]),

                Section::make('Metadata')
                    ->schema([
                        Placeholder::make('created_at')
                            ->label('Created Date')
                            ->content(fn(?Team $record): string => $record?->created_at?->diffForHumans() ?? '-'),

                        Placeholder::make('updated_at')
                            ->label('Last Modified Date')
                            ->content(fn(?Team $record): string => $record?->updated_at?->diffForHumans() ?? '-'),
                    ])
                    ->columns(2)
                    ->collapsed(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->copyable(),

                TextColumn::make('contest.name')
                    ->searchable()
                    ->sortable()
                    ->tooltip('Contest name'),

                TextColumn::make('coach.name')
                    ->searchable()
                    ->sortable()
                    ->tooltip(fn(Team $record): string => $record->coach->email),

                TextColumn::make('rank')
                    ->sortable()
                    ->badge()
                    ->color(fn(Team $record): string => match (true) {
                        $record->rank <= 3 => 'success',
                        $record->rank <= 10 => 'warning',
                        default => 'gray',
                    }),

                TextColumn::make('solve_count')
                    ->sortable()
                    ->badge(),

                TextColumn::make('members_count')
                    ->counts('members')
                    ->badge(),
            ])
            ->defaultSort('rank', 'asc')
            ->filters([
                // Add filters if needed
            ])
            ->actions([
                ViewAction::make(),
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            // Add relations if needed
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTeams::route('/'),
            'create' => Pages\CreateTeam::route('/create'),
            'edit' => Pages\EditTeam::route('/{record}/edit'),
        ];
    }

    public static function getGlobalSearchEloquentQuery(): Builder
    {
        return parent::getGlobalSearchEloquentQuery()->with(['contest', 'coach', 'members']);
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['name', 'contest.name', 'coach.name', 'members.name'];
    }

    public static function getGlobalSearchResultDetails(Model $record): array
    {
        return [
            'Contest' => $record->contest?->name,
            'Coach' => $record->coach?->name,
            'Members' => $record->members->pluck('name')->join(', '),
        ];
    }
}
