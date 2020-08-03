@extends('layouts.app')

@section('content')
<div class="container">
    @if(count($errors)>0)
        @foreach ($errors->all() as $error)
            <div class="alert alert-danger">
                {{ $error }}
            </div>
        @endforeach
    @endif
    @if (session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif
    <div class="row justify-content-center">
        <div class="card">
            <div class="card-header">{{ __('Edit Page')}}</div>
            <div class="card-body">
                {{ Form::open(['action'=>['PageController@update', $page->id], 'method'=>'PUT']) }}

                <div class="form-group">
                    {{ Form::label('name', 'Name') }}
                    {{ Form::text('name', $page->name, ['class'=>'from-control', 'placeholder'=>'Name of the Page']) }}
                </div>
                <div class="form-group">
                    {{ Form::label('title', 'Title') }}
                    {{ Form::text('title', $page->title, ['class'=>'from-control', 'placeholder'=>'Page Title']) }}
                </div>
                <div class="form-group">
                    {{ Form::label('content', 'Content') }}
                    {{ Form::textarea('content', $page->content, ['id'=>'content-editor','class'=>'from-control', 'placeholder'=>'Page Body']) }}
                </div>
                <div class="form-group">
                    {{ Form::label('meta_description', 'Meta description') }}
                    {{ Form::text('meta_description', $page->meta_description, ['class'=>'from-control', 'placeholder'=>'Meta Description']) }}
                </div>
                <div class="form-group">
                    {{ Form::label('no_index', 'No Index') }}
                    {{ Form::checkbox('no_index', $page->no_index) }}
                </div>
                <div class="form-group">
                <img width="250px" src="/storage/cover_images/{{ $page->cover_image }}" alt="cover-image">
                    {{ Form::file('cover_image') }}
                </div>
                {{ Form::submit('Submit', ['class'=>"btn btn-primary"]) }}


                {{ Form::close() }}
            </div>
        </div>
    </div>
</div>
@endsection
