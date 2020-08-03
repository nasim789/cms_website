@extends('../index')
@section('header')
<header class="navbar navbar-default navbar-inverse navbar-fixed-top" role="navigation">
    <div id="headwrap">

        <div id="titlelogo">
            <a href="https://cdainterview.com/">
                <div id="logo"><img src="{{ asset('websites/img') }}/bemo-logo2.png" width="167" height="100" alt="Site logo"></div>
                <h1></h1>
            </a>
            <h2></h2>
        </div>


        <div id="mwrap">
            <div id="lt"></div>
            <div id="lm"></div>
            <div id="lb"></div>
        </div>


        <div id="nwrap">
            <div id="menuBtn"></div>
            <nav>
                <ul class="navigation">
                    <li id="current"><a href="https://cdainterview.com/index.html" rel="self" id="current">Main</a></li>
                    <li><a href="https://cdainterview.com/how-to-prepare-for-cda-interview.html" rel="self">How To Prepare</a></li>
                    <li><a href="https://cdainterview.com/sample-cda-interview-questions.html" rel="self">CDA Interview Questions</a></li>
                    <li><a href="https://cdainterview.com/contact-us.php" rel="self">Contact Us</a></li>
                </ul>
            </nav>
        </div>
    </div>
</header>
@endsection
