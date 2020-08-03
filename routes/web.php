<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use App\Http\Controllers\PageController;

Route::get('/', 'PageController@show');

Auth::routes();

Route::get('/contact', 'PageController@contact');
Route::get('/pages/create', 'PageController@create');
Route::get('/pages', 'PageController@index');
Route::post('/pages', 'PageController@store');
Route::put('/pages/{id}', 'PageController@update');
Route::get('/pages/{id}/edit', 'PageController@edit');
Route::get('/{name}', 'PageController@show');
