@extends('layouts.app')

@section('content')
    <!-- Hero Section -->
    @include('partials.hero')

    <!-- What is DIU ACM Section -->
    @include('partials.what-is-diu-acm')

    <!-- Programs Section -->
    @include('partials.programs')

    <!-- Competitions Section -->
    @include('partials.competitions')

    <!-- Rules Section -->
    @include('partials.rules')

    <!-- Training Process Section -->
    @include('partials.training-process')

    <!-- CTA Section -->
    @include('partials.cta')
@endsection
