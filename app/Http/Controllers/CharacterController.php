<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CharacterController extends Controller
{
    public function dressingRoom()
    {
        $character = auth()->user()->character ?? null;

        return Inertia::render('Character/DressingRoom', [
            'character' => $character,
        ]);
    }
}