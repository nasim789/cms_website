@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row header">
        {{ __('List of Pages') }}
    </div>
    <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">{{ __('Page Name') }}</th>
            <th scope="col">{{ __('Title') }}</th>
            <th scope="col">{{ __('Actions') }}</th>
          </tr>
        </thead>
        <tbody>
            @foreach ($pages as $page)
            <tr>
                <th scope="row">{{$page->id}}</th>
                <td>{{$page->name}}</td>
                <td>{{$page->title}}</td>
                <td>
                    <a href="/pages/{{$page->id}}/edit" class="btn btn-primary">Edit</a>
                </td>
              </tr>
            @endforeach
        </tbody>
      </table>
</div>

@endsection
