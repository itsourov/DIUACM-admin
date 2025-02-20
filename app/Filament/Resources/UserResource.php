<?php

namespace App\Filament\Resources;

use App\Enums\Gender;
use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';

    protected static ?string $navigationGroup = 'User Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Basic Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('username')
                            ->required()
                            ->unique(ignorable: fn ($record) => $record)
                            ->maxLength(255),
                        Forms\Components\TextInput::make('email')
                            ->email()
                            ->required()
                            ->unique(ignorable: fn ($record) => $record)
                            ->maxLength(255),
                        Forms\Components\TextInput::make('phone')
                            ->tel()
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Select::make('gender')
                            ->options(collect(Gender::cases())->mapWithKeys(fn ($gender) => [$gender->value => $gender->getLabel()]))
                            ->native(false)
                            ->nullable(),
                        Forms\Components\TextInput::make('password')
                            ->password()
                            ->dehydrated(fn ($state) => filled($state))
                            ->required(fn (string $context): bool => $context === 'create'),
                    ])->columns(2),

                Forms\Components\Section::make('Academic Information')
                    ->schema([
                        Forms\Components\TextInput::make('student_id')
                            ->label('Student ID')
                            ->nullable(),
                        Forms\Components\TextInput::make('department')
                            ->nullable(),
                        Forms\Components\TextInput::make('starting_semester')
                            ->nullable(),
                    ])->columns(3),

                Forms\Components\Section::make('Competitive Programming Profiles')
                    ->schema([
                        Forms\Components\TextInput::make('codeforces_handle')
                            ->label('Codeforces Handle')
                            ->nullable()
                            ->prefix('https://codeforces.com/profile/'),
                        Forms\Components\TextInput::make('atcoder_handle')
                            ->label('AtCoder Handle')
                            ->nullable()
                            ->prefix('https://atcoder.jp/users/'),
                        Forms\Components\TextInput::make('vjudge_handle')
                            ->label('Vjudge Handle')
                            ->nullable()
                            ->prefix('https://vjudge.net/user/'),
                        Forms\Components\TextInput::make('max_cf_rating')
                            ->label('Max CF Rating')
                            ->numeric()
                            ->nullable(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->circular(),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('username')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('phone')
                    ->searchable(),
                Tables\Columns\TextColumn::make('gender')
                    ->badge()
                    ->color(fn (Gender $state): string => $state->getColor()),
                Tables\Columns\TextColumn::make('department')
                    ->searchable(),
                Tables\Columns\TextColumn::make('student_id')
                    ->label('Student ID')
                    ->searchable(),
                Tables\Columns\TextColumn::make('max_cf_rating')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('email_verified_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('gender')
                    ->options(collect(Gender::cases())->mapWithKeys(fn ($gender) => [$gender->value => $gender->getLabel()])),
                Tables\Filters\SelectFilter::make('department')
                    ->options([
                        'CSE' => 'CSE',
                        'EEE' => 'EEE',
                        'Civil' => 'Civil',
                        'Mechanical' => 'Mechanical',
                        'BBA' => 'BBA',
                    ]),
                Tables\Filters\Filter::make('has_cf_rating')
                    ->query(fn (Builder $query): Builder => $query->whereNotNull('max_cf_rating')),
                Tables\Filters\Filter::make('verified')
                    ->query(fn (Builder $query): Builder => $query->whereNotNull('email_verified_at')),
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

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
//            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
