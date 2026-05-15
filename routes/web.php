<?php

use App\Http\Controllers\DisplayController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Queue management routes - React components
Route::get('/queue/display', function () {
    return Inertia::render('queue/display');
})->name('queue.display');

Route::get('/queue/ticket', function () {
    return Inertia::render('queue/ticket');
})->name('queue.ticket');

Route::get('/queue/management', function () {
    return Inertia::render('queue/management');
})->name('queue.management');

// Legacy routes for backwards compatibility
Route::get('/display', [DisplayController::class, 'index'])->name('display.index');
Route::get('/ticket', [DisplayController::class, 'ticket'])->name('display.ticket');
Route::post('/ticket', [DisplayController::class, 'createTicket'])->name('display.create-ticket');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
