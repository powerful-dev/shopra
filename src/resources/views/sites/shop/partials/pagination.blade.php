@if ($paginator->hasPages())
  <nav class="uk-margin-large-top" aria-label="Навигация по страницам каталога">
    <ul class="uk-pagination uk-flex-center" uk-margin>
      @if ($paginator->onFirstPage())
        <li class="uk-disabled"><span aria-hidden="true" uk-pagination-previous></span></li>
      @else
        <li><a href="{{ $paginator->previousPageUrl() }}" rel="prev" aria-label="Предыдущая страница" uk-pagination-previous></a></li>
      @endif

      @foreach ($elements as $element)
        @if (is_string($element))
          <li class="uk-disabled"><span>{{ $element }}</span></li>
        @endif

        @if (is_array($element))
          @foreach ($element as $page => $url)
            @if ($page === $paginator->currentPage())
              <li class="uk-active"><span aria-current="page">{{ $page }}</span></li>
            @else
              <li><a href="{{ $url }}" aria-label="Страница {{ $page }}">{{ $page }}</a></li>
            @endif
          @endforeach
        @endif
      @endforeach

      @if ($paginator->hasMorePages())
        <li><a href="{{ $paginator->nextPageUrl() }}" rel="next" aria-label="Следующая страница" uk-pagination-next></a></li>
      @else
        <li class="uk-disabled"><span aria-hidden="true" uk-pagination-next></span></li>
      @endif
    </ul>
  </nav>
@endif
