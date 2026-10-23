<!doctype html>
<html lang="ru" data-shopra-store="fashion" data-shopra-asset-base="{{ $shopAssetBase }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="@yield('description', 'VERA — современная одежда для города.')">
    <title>@yield('title', 'VERA — modern uniform')</title>
    @vite([
        'layout/shop/css/uikit.min.css',
        'layout/shop/css/shopra-gradients.css',
        'layout/shop/css/themes/shopra-theme-core.css',
        'layout/shop/css/shopra-spacing.css',
        'layout/shop/css/themes/palettes/athletic.css',
        'layout/shop/css/themes/shapes/straight.css',
        'layout/shop/css/themes/fonts/fashion.css',
        'layout/shop/css/themes/icons/organic.css',
        'layout/shop/css/themes/icon-backgrounds/bare.css',
        'layout/shop/css/themes/menus/gymshark.css',
    ])
    @stack('head')
  </head>
  <body>
    @include('sites.shop.header')

    @yield('content')

    @include('sites.shop.footer')
    @include('sites.shop.mobile-menu')

    @stack('modals')
    @vite('resources/js/sites/shop.js')
  </body>
</html>

