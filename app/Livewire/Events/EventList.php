<?php

namespace App\Livewire\Events;

use App\Models\Event;
use Illuminate\Contracts\View\View;
use Livewire\Component;
use Livewire\WithPagination;
use Carbon\Carbon;

class EventList extends Component
{
    use WithPagination;

    public $search = '';
    public $perPage = 8;

    protected $queryString = [
        'search' => ['except' => ''],
    ];

    public function updatingSearch(): void
    {
        $this->resetPage();
    }

    public function getEventStatus($startDate, $endDate): array
    {
        if (!$startDate || !$endDate) {
            return ['unknown', 'gray'];
        }

        $now = Carbon::now();
        $startDate = Carbon::parse($startDate);
        $endDate = Carbon::parse($endDate);

        if ($now->lt($startDate)) {
            return ['upcoming', 'blue'];
        } elseif ($now->gt($endDate)) {
            return ['past', 'gray'];
        }
        return ['running', 'green'];
    }

    public function render(): View
    {

        $events = Event::query()
            ->where('status', 'published')
            ->where(function ($query) {
                $query->where('title', 'like', '%' . $this->search . '%')
                    ->orWhere('type', 'like', '%' . $this->search . '%')
                    ->orWhere('attendance_scope', 'like', '%' . $this->search . '%');
            })
            ->orderBy('starting_at', 'desc')
            ->paginate($this->perPage);

        return view('livewire.events.event-list', [
            'events' => $events
        ]);
    }
}
