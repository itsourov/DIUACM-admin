<?php

namespace App\Filament\Resources;

use App\Enums\VisibilityStatuses;
use App\Filament\Resources\TrackerResource\Pages;
use App\Models\Tracker;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ToggleButtons;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class TrackerResource extends Resource
{
    protected static ?string $model = Tracker::class;

    protected static ?string $slug = 'trackers';

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Grid::make(2)
                    ->schema([
                        Section::make('Basic Information')
                            ->description('Enter the main details of the tracker')
                            ->schema([
                                TextInput::make('title')
                                    ->required()
                                    ->reactive()
                                    ->minLength(3)
                                    ->maxLength(255)
                                    ->placeholder('Enter title')
                                    ->helperText('The title will be automatically converted to a URL-friendly slug')
                                    ->afterStateUpdated(fn($state, callable $set) => $set('slug', Str::slug($state))),

                                TextInput::make('slug')
                                    ->required()
                                    ->unique(Tracker::class, 'slug', fn($record) => $record)
                                    ->helperText('This is the URL-friendly version of the title')
                                    ->dehydrated(),

                                Textarea::make('description')
                                    ->required()
                                    ->rows(3)
                                    ->minLength(10)
                                    ->maxLength(1000)
                                    ->placeholder('Enter description')
                                    ->helperText('Provide a detailed description'),

                                ToggleButtons::make('status')
                                    ->enum(VisibilityStatuses::class)
                                    ->options(VisibilityStatuses::class)
                                    ->default(VisibilityStatuses::DRAFT)
                                    ->inline()
                                    ->required(),
                            ])
                            ->columnSpan(2),

                        Section::make('Metadata')
                            ->description('System generated information')
                            ->schema([
                                Grid::make(2)
                                    ->schema([
                                        Placeholder::make('created_at')
                                            ->label('Created Date')
                                            ->content(fn(?Tracker $record): string => $record?->created_at?->format('Y-m-d H:i:s') ?? '-'),

                                        Placeholder::make('updated_at')
                                            ->label('Last Modified Date')
                                            ->content(fn(?Tracker $record): string => $record?->updated_at?->format('Y-m-d H:i:s') ?? '-'),
                                    ]),
                            ])
                            ->columnSpan(2),
                    ])
                    ->columnSpan('full'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('slug')
                    ->searchable()
                    ->sortable(),

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
            'index' => Pages\ListTrackers::route('/'),
            'create' => Pages\CreateTracker::route('/create'),
            'edit' => Pages\EditTracker::route('/{record}/edit'),
        ];
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['title', 'slug'];
    }
}
