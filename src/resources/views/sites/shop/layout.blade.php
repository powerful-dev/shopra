@php($shopAppearance = config('shop.appearance'))

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
        'layout/shop/css/themes/palettes/'.$shopAppearance['palette'].'.css',
        'layout/shop/css/themes/shapes/'.$shopAppearance['shape'].'.css',
        'layout/shop/css/themes/fonts/'.$shopAppearance['font'].'.css',
        'layout/shop/css/themes/icons/'.$shopAppearance['icons'].'.css',
        'layout/shop/css/themes/icon-backgrounds/'.$shopAppearance['icon_background'].'.css',
        'layout/shop/css/themes/menus/'.$shopAppearance['menu'].'.css',
    ])
    @stack('head')
  </head>
  <body>
    @yield('before-header')

    @include('sites.shop.header')

    @yield('content')

    @hasSection('footer')
      @yield('footer')
    @else
      @include('sites.shop.footer')
    @endif
    @include('sites.shop.mobile-menu')

    @stack('modals')
    @vite($shopScript ?? 'resources/js/sites/shop.js')
  </body>
</html>

