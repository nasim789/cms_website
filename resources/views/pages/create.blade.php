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
            <div class="card-header">{{ __('Create Page')}}</div>
            <div class="card-body">
                {{ Form::open(['action'=>'PageController@store', 'method'=>'POST', 'enctype' => 'multipart/form-data']) }}

                <div class="form-group">
                    {{ Form::label('name', 'Name') }}
                    {{ Form::text('name', '', ['class'=>'from-control', 'placeholder'=>'Name of the Page']) }}
                </div>
                <div class="form-group">
                    {{ Form::label('title', 'Title') }}
                    {{ Form::text('title', '', ['class'=>'from-control', 'placeholder'=>'Page Title']) }}
                </div>
                <div class="form-group">
                    {{ Form::label('content', 'Content') }}
                    {{ Form::textarea('content', '', ['id'=>'content-editor','class'=>'from-control', 'placeholder'=>'Page Body']) }}
                </div>
                <div class="form-group">
                    {{ Form::label('meta_description', 'Meta description') }}
                    {{ Form::text('meta_description', '', ['class'=>'from-control', 'placeholder'=>'Meta Description']) }}
                </div>
                <div class="form-group">
                    {{ Form::label('no_index', 'No Index') }}
                    {{ Form::checkbox('no_index', 1, 0) }}
                </div>
                <div class="form-group">
                    {{ Form::file('cover_image') }}
                </div>
                {{ Form::submit('Submit', ['class'=>"btn btn-primary"]) }}


                {{ Form::close() }}
            </div>
        </div>
    </div>
</div>
@endsection
