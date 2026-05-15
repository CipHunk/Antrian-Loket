<?php

namespace App\Events;

use App\Models\Ticket;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TicketCalled implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Ticket $ticket)
    {
        //
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('queue'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'ticket.called';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->ticket->id,
            'service' => $this->ticket->service->name,
            'prefix' => $this->ticket->service->prefix,
            'number_int' => $this->ticket->number_int,
            'number_str' => $this->ticket->number_str,
            'counter' => $this->ticket->counter?->name,
            'called_at' => optional($this->ticket->called_at)->toIso8601String(),
        ];
    }
}
