<?php

namespace App\Filament\Resources\RankListResource\RelationManagers;


use App\Enums\Gender;
use App\Filament\Resources\UserResource;
use Filament\Forms\Components\Tabs;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Actions\AttachAction;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class UsersRelationManager extends RelationManager
{
    protected static string $relationship = 'users';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Tabs::make('Tabs')
                    ->columnSpan(2)
                    ->tabs([
                        Tabs\Tab::make('Aditional Info')
                            ->schema([
                                TextInput::make('score')
                                    ->numeric()
                                    ->default(0.0)
                                    ->step(0.01)
                                    ->minValue(0.0),
                            ]),
                        Tabs\Tab::make('User Info')
                            ->schema(UserResource::form($form)->getComponents()),
                    ])
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('score')
                    ->badge()
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
                    ->color(fn(Gender $state): string => $state->getColor()),
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
                //
            ])
            ->headerActions([
                AttachAction::make('attach')
                    ->recordSelectSearchColumns(['email', 'name', 'student_id', 'username', 'phone', 'codeforces_handle', 'atcoder_handle', 'vjudge_handle'])
                    ->preloadRecordSelect()
                    ->modalWidth('3xl')
                    ->recordTitle(function ($record) {
                        return $record->name . ' || ' . $record->username;
                    })
                    ->multiple()
                    ->form(fn(AttachAction $action): array => [
                        $action->getRecordSelect(),
                        TextInput::make('score')
                            ->numeric()
                            ->default(0.0)
                            ->step(0.01)
                            ->minValue(0.0)
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
