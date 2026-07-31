<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name') }} — Administration</title>
    @viteReactRefresh
    @vite('resources/js/admin.jsx')
</head>
<body>
    <div 
        id="admin-app"
        data-store-url="{{ route('home') }}">
    </div>
</body>
</html>
