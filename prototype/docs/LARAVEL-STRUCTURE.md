# Рекомендуемая структура Laravel

Структуру можно адаптировать к существующему проекту, но разделение ответственности лучше сохранить.

```text
app/
  Http/
    Controllers/
      Admin/
        DashboardController.php
        PlaceholderController.php
    View/
      Composers/
        AdminNavigationComposer.php

config/
  admin-navigation.php

resources/
  css/
    admin.css
  js/
    admin.js
  views/
    admin/
      layouts/
        app.blade.php
      partials/
        sidebar.blade.php
        mobile-navigation.blade.php
        topbar.blade.php
        notifications.blade.php
      components/
        metric-card.blade.php
        order-row.blade.php
        sales-chart.blade.php
        quick-action.blade.php
        setup-progress.blade.php
        empty-state.blade.php
      dashboard/
        index.blade.php
      placeholders/
        module.blade.php

routes/
  admin.php
```

## Маршруты первого этапа

Рекомендуемые имена:

```text
admin.dashboard
admin.appearance.index
admin.products.index
admin.orders.index
admin.shipping.index
admin.payments.index
admin.discounts.index
admin.analytics.index
admin.domains.index
admin.settings.index
```

На этапе 1 полноценный контроллер нужен только для `admin.dashboard`. Остальные маршруты могут использовать единый `PlaceholderController`, но должны иметь собственные имена и URL.

## Навигация как конфигурация

Не дублировать массив меню в нескольких Blade-файлах. Хранить пункты в одном месте:

- label;
- route;
- icon;
- optional badge key;
- permission key на будущее.

Активное состояние определять через `request()->routeIs(...)`.

## Blade-layout

`admin/layouts/app.blade.php` отвечает только за:

- общий HTML-каркас;
- подключение UIkit и ресурсов админки;
- desktop sidebar;
- mobile navigation;
- topbar;
- `@yield('content')`.

Главная страница не должна содержать разметку бокового меню.

## Компоненты

Карточки показателей, строки заказов, быстрые действия и прогресс запуска оформить отдельными Blade-компонентами. Тогда их можно будет переиспользовать, когда реальные модули появятся позднее.

## CSS

Перенести из прототипа не селекторы React-компонентов, а визуальные токены:

```css
:root {
  --shopra-ink: #1d1a17;
  --shopra-muted: #77716b;
  --shopra-line: #e9e4df;
  --shopra-canvas: #f7f6f3;
  --shopra-accent: #b84f18;
  --shopra-accent-dark: #8c3510;
  --shopra-accent-soft: #f9eee7;
  --shopra-success: #2e8b45;
}
```

UIkit используется как база. Собственные классы Shopra должны иметь понятный префикс или быть ограничены контейнером админки, чтобы не влиять на витрину магазина.

## JavaScript

На первом этапе JavaScript нужен только для:

- открытия/закрытия мобильного меню;
- поиска;
- уведомлений;
- раскрытия полного списка запуска;
- переключения периода графика.

Эти действия должны работать независимо от конкретного фреймворка фронтенда. Если в проекте уже используется Alpine.js, можно применить его; добавлять новый фреймворк только ради этих действий не нужно.

## Данные и права

- магазин брать из текущего контекста владельца;
- маршруты админки защищать существующей авторизацией;
- возможность переключения магазина показывать только пользователям с доступом более чем к одному магазину;
- права разделов позже можно добавить к конфигурации меню без перестройки шаблона.

