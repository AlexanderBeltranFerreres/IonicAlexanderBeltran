<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);
Route::post('/register', [App\Http\Controllers\Api\AuthController::class, 'register']);


Route::middleware('auth:sanctum')->group(function ()
{
    Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/multimedia', [App\Http\Controllers\Api\ApiMultimediaController::class, 'store']);
    Route::get('/multimedia', [App\Http\Controllers\Api\ApiMultimediaController::class, 'index']);
    Route::get('/multimedia/user', [App\Http\Controllers\Api\ApiMultimediaController::class, 'showByUser']);
    Route::delete('/multimedia/{id}', [App\Http\Controllers\Api\ApiMultimediaController::class, 'destroy']);
});

