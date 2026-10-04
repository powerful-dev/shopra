<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="category-image-upload-max-bytes" content="{{ config('media.image_max_kilobytes') * 1024 }}">
    <title>{{ config('app.name') }} — Administration</title>
    @viteReactRefresh
    @vite('resources/js/admin.jsx')
</head>
<body>
    <div 
        id="admin-app"
        data-app-name="{{ config('app.name') }}"
        data-supported-currencies='@json(\App\Enums\SupportedCurrency::options())'
        data-store-url="{{ route('home') }}">
    </div>
</body>
</html>
