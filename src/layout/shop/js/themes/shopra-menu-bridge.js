/*
 * One permanent UIkit bridge, two independently selected menu CSS presets.
 * Category names and URLs come from the existing navbar, not a second data set.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var UI = window.UIkit;
  var state;
  var refreshFrame;
  var desktop = window.matchMedia('(min-width: 960px)');
  var boundLinks = new WeakSet();

  function element(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }

  function label(anchor) {
    var copy = anchor.cloneNode(true);
    copy.querySelectorAll('[uk-navbar-parent-icon], [uk-nav-parent-icon], svg').forEach(function (icon) { icon.remove(); });
    return copy.textContent.replace(/\s+/g, ' ').trim();
  }

  function readNode(li) {
    var anchor = li.querySelector(':scope > a');
    if (!anchor) return null;
    var children = li.querySelector(':scope > ul');
    var href = anchor.getAttribute('href');
    return {
      title: label(anchor),
      href: href && href !== '#' ? href : null,
      children: children ? Array.from(children.children).map(readNode).filter(Boolean) : []
    };
  }

  function readGroups(dropdown) {
    return Array.from(dropdown.querySelectorAll('.uk-navbar-dropdown-nav')).map(function (list) {
      var heading = list.querySelector(':scope > .uk-nav-header');
      return {
        title: heading ? heading.textContent.trim() : '',
        items: Array.from(list.children).map(readNode).filter(Boolean)
      };
    });
  }

  function chevron() {
    var icon = element('span', 'shopra-menu-chevron');
    icon.setAttribute('aria-hidden', 'true');
    return icon;
  }

  function row(node, action) {
    var el = element(action ? 'button' : 'a', 'shopra-menu-row');
    el.append(element('span', '', node.title));
    if (action) {
      el.type = 'button';
      el.append(chevron());
      el.addEventListener('click', action);
    } else {
      el.href = node.href || state.sections[0].href;
    }
    return el;
  }

  function leaves(nodes) {
    return nodes.flatMap(function (node) { return node.children.length ? leaves(node.children) : [node]; });
  }

  function promos() {
    var seen = new Set();
    return Array.from(document.querySelectorAll('main img[src*="/products/"]')).filter(function (img) {
      var src = img.getAttribute('src');
      if (seen.has(src)) return false;
      seen.add(src);
      return true;
    }).slice(0, 2).map(function (img) {
      var anchor = img.closest('a[href]');
      return { src: img.getAttribute('src'), title: img.alt, href: anchor ? anchor.getAttribute('href') : 'catalog.html' };
    });
  }

  function promoCards() {
    var list = element('div', 'shopra-menu-promos');
    state.promos.forEach(function (promo) {
      var card = element('a', 'shopra-menu-promo');
      card.href = promo.href;
      var img = element('img');
      img.src = promo.src;
      img.alt = '';
      img.loading = 'lazy';
      card.append(img, element('span', '', promo.title));
      list.append(card);
    });
    return list;
  }

  function buildRails(section, dropdown, index) {
    var rail = element('div', 'shopra-menu-rail');
    var secondary = element('div', 'shopra-menu-rail shopra-menu-secondary');
    secondary.id = 'shopra-menu-secondary-' + index;
    secondary.hidden = true;
    var current;
    function select(node, button, moveFocus) {
      if (current) current.setAttribute('aria-expanded', 'false');
      current = button;
      button.setAttribute('aria-expanded', 'true');
      secondary.replaceChildren(element('p', 'shopra-menu-eyebrow', node.title));
      leaves(node.children).forEach(function (child) { secondary.append(row(child)); });
      secondary.hidden = false;
      dropdown.dataset.expanded = 'true';
      if (moveFocus) secondary.querySelector('a').focus({ preventScroll: true });
    }
    function closeSecondary() {
      if (current) current.setAttribute('aria-expanded', 'false');
      secondary.hidden = true;
      dropdown.dataset.expanded = 'false';
      current = null;
    }
    section.groups.forEach(function (group) {
      if (group.title) rail.append(element('p', 'shopra-menu-eyebrow', group.title));
      group.items.forEach(function (node) {
        if (!node.children.length) {
          var link = row(node);
          link.addEventListener('pointerenter', closeSecondary);
          rail.append(link);
          return;
        }
        var button = row(node, function () { select(node, button, true); });
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', secondary.id);
        button.addEventListener('pointerenter', function (event) {
          if (event.pointerType !== 'touch') select(node, button, false);
        });
        button.addEventListener('keydown', function (event) {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            select(node, button, true);
          }
        });
        rail.append(button);
      });
    });
    if (index === 0) rail.append(promoCards());
    secondary.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        var button = current;
        closeSecondary();
        if (button) button.focus({ preventScroll: true });
      }
    });
    dropdown.addEventListener('hidden', closeSecondary, { signal: state.layoutController.signal });
    dropdown.append(rail, secondary);
  }

  function buildColumns(section, dropdown) {
    var grid = element('div', 'shopra-menu-columns');
    var columns = [];
    section.groups.forEach(function (group) {
      var parents = group.items.filter(function (node) { return node.children.length; });
      var direct = group.items.filter(function (node) { return !node.children.length; });
      if (!parents.length) {
        columns.push({ title: group.title || section.title, children: direct });
      } else {
        parents.forEach(function (node, index) {
          columns.push({ title: node.title, children: leaves(node.children), extra: index === 0 ? direct : [] });
        });
      }
    });
    grid.style.setProperty('--shopra-menu-columns', Math.min(5, Math.max(3, columns.length)));
    columns.forEach(function (node) {
      var column = element('section', 'shopra-menu-column');
      column.append(element('h2', 'shopra-menu-column-title', node.title));
      node.children.forEach(function (child) { column.append(row(child)); });
      if (node.extra && node.extra.length) {
        var extra = element('div', 'shopra-menu-column-extra');
        node.extra.forEach(function (child) { extra.append(row(child)); });
        column.append(extra);
      }
      grid.append(column);
    });
    dropdown.append(grid);
  }

  function syncPosition() {
    root.style.setProperty('--shopra-menu-top', Math.max(0, state.header.getBoundingClientRect().bottom) + 'px');
  }

  function closeDesktop() {
    if (!state) return;
    state.drops.forEach(function (drop) { drop.hide(false); });
  }

  function syncBackdrop() {
    var open = desktop.matches && state.drops.some(function (drop) { return drop.isToggled(); });
    state.backdrop.hidden = !open;
  }

  function mobileItems(section) {
    return section.groups.flatMap(function (group) { return group.items; });
  }

  function mobileSupport(container) {
    var support = element('div', 'shopra-menu-support');
    support.append(row({ title: 'О бренде', href: state.sections[state.sections.length - 1].href }));
    if (state.phone) support.append(row(state.phone));
    container.append(support);
  }

  function renderMobile(moveFocus) {
    var body = state.mobileBody;
    body.replaceChildren();
    var screen = element('div', 'shopra-menu-screen');
    screen.id = 'shopra-menu-mobile-screen';
    screen.setAttribute('aria-label', 'Рубрики магазина');
    var path = state.path;
    var gym = state.layout === 'gymshark';
    if (path.length) {
      var current = path[path.length - 1];
      var back = element('button', 'shopra-menu-back');
      back.type = 'button';
      back.append(chevron(), element('span', '', current.title));
      back.setAttribute('aria-label', 'Назад — ' + current.title);
      back.addEventListener('click', function () { path.pop(); renderMobile(true); });
      screen.append(back);
      if (gym) {
        current.children.forEach(function (node) {
          screen.append(row(node, node.children.length ? function () {
            path.push(node); renderMobile(true);
          } : null));
        });
      } else {
        var accordion = element('ul', 'shopra-menu-accordion');
        current.children.forEach(function (node) {
          var li = element('li');
          if (node.children.length) {
            var toggle = element('button', 'shopra-menu-row shopra-menu-accordion-toggle', node.title);
            toggle.type = 'button';
            toggle.append(element('span', 'shopra-menu-plus'));
            var content = element('div', 'uk-accordion-content');
            content.hidden = true;
            leaves(node.children).forEach(function (child) { content.append(row(child)); });
            li.append(toggle, content);
          } else {
            li.append(row(node));
          }
          accordion.append(li);
        });
        screen.append(accordion);
        UI.accordion(accordion, { targets: '> li:has(> button)', toggle: '> button', content: '> .uk-accordion-content', multiple: false });
      }
      if (current.href) screen.append(row({ title: 'Смотреть всё', href: current.href }));
    } else if (gym) {
      var tabs = element('div', 'shopra-menu-tabs');
      tabs.setAttribute('role', 'tablist');
      tabs.setAttribute('aria-label', 'Разделы магазина');
      var tabSections = state.sections.filter(function (section) { return section.groups.length; });
      tabSections.forEach(function (section, index) {
        var tab = element('button', 'shopra-menu-tab', section.title);
        tab.type = 'button';
        tab.id = 'shopra-menu-tab-' + index;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', 'shopra-menu-mobile-screen');
        tab.setAttribute('aria-selected', String(state.mobileTab === index));
        tab.tabIndex = state.mobileTab === index ? 0 : -1;
        tab.addEventListener('click', function () { state.mobileTab = index; renderMobile(); body.querySelector('#' + tab.id).focus({ preventScroll: true }); });
        tab.addEventListener('keydown', function (event) {
          if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();
            state.mobileTab = event.key === 'Home' ? 0 : event.key === 'End' ? tabSections.length - 1 :
              (index + (event.key === 'ArrowRight' ? 1 : -1) + tabSections.length) % tabSections.length;
            renderMobile();
            body.querySelector('#shopra-menu-tab-' + state.mobileTab).focus({ preventScroll: true });
          }
        });
        tabs.append(tab);
      });
      body.append(tabs);
      var section = tabSections[state.mobileTab];
      screen.setAttribute('role', 'tabpanel');
      screen.setAttribute('aria-labelledby', 'shopra-menu-tab-' + state.mobileTab);
      if (state.mobileTab === 0) screen.append(promoCards());
      section.groups.forEach(function (group) {
        if (group.title) screen.append(element('p', 'shopra-menu-eyebrow', group.title));
        group.items.forEach(function (node) {
          screen.append(row(node, node.children.length ? function () { path.push(node); renderMobile(true); } : null));
        });
      });
      mobileSupport(screen);
    } else {
      screen.classList.add('shopra-menu-home');
      screen.append(row({ title: 'Главная', href: state.logo.getAttribute('href') }));
      state.sections.forEach(function (section) {
        screen.append(row(section, section.groups.length ? function () {
          path.push({ title: section.title, href: section.href, children: mobileItems(section) });
          renderMobile(true);
        } : null));
      });
      if (state.phone) {
        var support = element('div', 'shopra-menu-support');
        support.append(row(state.phone));
        screen.append(support);
      }
    }
    body.append(screen);
    state.mobileBar.scrollTop = 0;
    state.search.hidden = path.length > 0;
    if (moveFocus) (screen.querySelector('button, a') || state.close).focus({ preventScroll: true });
  }

  function initMobile() {
    var offcanvas = document.querySelector('#mobile-menu');
    if (!offcanvas) return;
    state.mobile = offcanvas;
    state.mobileBar = offcanvas.querySelector('.uk-offcanvas-bar');
    var originalNav = state.mobileBar.querySelector('.uk-nav-default');
    if (originalNav) originalNav.hidden = true;
    var close = state.mobileBar.querySelector('.uk-offcanvas-close');
    var logo = state.mobileBar.querySelector('.uk-logo');
    var head = element('div', 'shopra-menu-mobile-head');
    close.setAttribute('aria-label', 'Закрыть меню');
    state.close = close;
    head.append(logo, close);
    var favorite = element('a', 'shopra-menu-mobile-favorite');
    var favoriteTarget = state.header.querySelector('[aria-label="Избранное"]');
    favorite.href = favoriteTarget ? favoriteTarget.getAttribute('href') : '#header-favorite';
    favorite.setAttribute('aria-label', 'Избранное');
    favorite.setAttribute('uk-icon', 'heart');
    favorite.addEventListener('click', function (event) {
      event.preventDefault();
      UI.offcanvas(offcanvas).hide();
      if (favoriteTarget) favoriteTarget.click();
    });
    head.append(favorite);
    state.mobileBar.prepend(head);
    state.search = element('button', 'shopra-menu-search');
    state.search.type = 'button';
    var icon = element('span');
    icon.setAttribute('uk-icon', 'search');
    state.search.append(icon, element('span', '', 'Поиск товаров'));
    state.search.addEventListener('click', function () {
      UI.offcanvas(offcanvas).hide().then(function () { UI.modal('#search-modal').show(); });
    });
    state.mobileBody = element('div', 'shopra-menu-mobile-body');
    state.mobileBar.append(state.search, state.mobileBody);
    offcanvas.addEventListener('beforeshow', function (event) {
      if (event.target !== offcanvas) return;
      closeDesktop();
      state.path = [];
      state.mobileTab = 0;
      renderMobile();
    });
    offcanvas.addEventListener('shown', function (event) {
      if (event.target === offcanvas) close.focus({ preventScroll: true });
    });
    offcanvas.addEventListener('hidden', function (event) {
      if (event.target !== offcanvas) return;
      var trigger = state.header.querySelector('[href="#mobile-menu"]');
      if (trigger && desktop.matches === false) trigger.focus({ preventScroll: true });
    });
    state.mobileBody.addEventListener('click', function (event) {
      if (event.target.closest('a[href]')) UI.offcanvas(offcanvas).hide();
    });
  }

  function init() {
    var header = document.querySelector('body > header');
    var nav = header && header.querySelector('.uk-navbar-nav');
    if (!nav) return; // Checkout keeps its distraction-free header.
    // Keep the UIkit navbar layout, but give the shared bridge sole ownership
    // of its drops. Navbar's auto-generated toggles otherwise compete with
    // the independently configured dropdown instances and keyboard handlers.
    var navbar = nav.closest('[uk-navbar]');
    if (navbar) {
      var navbarComponent = UI.getComponent(navbar, 'navbar');
      if (navbarComponent) navbarComponent.$destroy();
      navbar.removeAttribute('uk-navbar');
      navbar.classList.add('uk-navbar');
    }
    var sections = Array.from(nav.children).map(function (li) {
      var anchor = li.querySelector(':scope > a');
      var dropdown = li.querySelector(':scope > .uk-navbar-dropdown');
      return { title: label(anchor), href: anchor.getAttribute('href'), anchor: anchor,
        dropdown: dropdown, groups: dropdown ? readGroups(dropdown) : [] };
    });
    state = { header: header, nav: nav, sections: sections, drops: [], promos: promos(), path: [], mobileTab: 0 };
    state.logo = header.querySelector('.uk-logo');
    var phone = document.querySelector('#mobile-menu a[href^="tel:"]');
    state.phone = phone ? { title: phone.textContent.trim(), href: phone.getAttribute('href') } : null;
    header.classList.add('shopra-menu-header');
    state.backdrop = element('div', 'shopra-menu-backdrop');
    state.backdrop.hidden = true;
    state.backdrop.setAttribute('aria-hidden', 'true');
    state.backdrop.addEventListener('click', closeDesktop);
    document.body.append(state.backdrop);
    sections.forEach(function (section, index) {
      if (!section.dropdown) return;
      var drop = UI.getComponent(section.dropdown, 'drop');
      if (drop) drop.$destroy();
      var toggle = UI.getComponent(section.anchor, 'toggle');
      if (toggle) toggle.$destroy();
      section.anchor.id = section.anchor.id || 'shopra-menu-trigger-' + index;
      section.dropdown.classList.add('shopra-menu-desktop');
      section.dropdown.id = 'shopra-menu-desktop-' + index;
      section.dropdown.setAttribute('aria-label', section.title);
      drop = UI.drop(section.dropdown, { toggle: '#' + section.anchor.id, mode: ['click', 'hover'],
        delayShow: 120, delayHide: 180, offset: 0, flip: false, animation: false, duration: 120 });
      state.drops.push(drop);
      // A mouse can open the drop on hover immediately before its click.
      // Keep that click on the menu instead of navigating or closing the drop.
      section.anchor.addEventListener('click', function (event) {
        if (!desktop.matches || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        drop.show(section.anchor, false);
      }, true);
      section.dropdown.addEventListener('beforeshow', syncPosition);
      section.dropdown.addEventListener('show', syncBackdrop);
      section.dropdown.addEventListener('hide', function () { requestAnimationFrame(syncBackdrop); });
      section.dropdown.addEventListener('click', function (event) {
        if (event.target.closest('a[href]')) drop.hide(false);
      });
      section.anchor.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          event.stopPropagation();
          function focusFirst() {
            requestAnimationFrame(function () {
              var target = section.dropdown.querySelector('button, a');
              if (target) target.focus({ preventScroll: true });
            });
          }
          if (drop.isToggled()) focusFirst();
          else {
            section.dropdown.addEventListener('shown', focusFirst, { once: true });
            drop.show(section.anchor, false);
          }
        }
      });
      section.dropdown.addEventListener('keydown', function (event) {
        if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
        var controls = Array.from(section.dropdown.querySelectorAll('button, a[href]')).filter(function (control) {
          return control.getClientRects().length;
        });
        var current = controls.indexOf(document.activeElement);
        var next = event.key === 'Home' ? 0 : event.key === 'End' ? controls.length - 1 :
          (current + (event.key === 'ArrowDown' ? 1 : -1) + controls.length) % controls.length;
        if (controls[next]) { event.preventDefault(); controls[next].focus({ preventScroll: true }); }
      });
    });
    initMobile();
    new ResizeObserver(syncPosition).observe(header);
    window.addEventListener('scroll', syncPosition, { passive: true });
    desktop.addEventListener('change', function () {
      closeDesktop();
      if (desktop.matches && state.mobile) UI.offcanvas(state.mobile).hide();
      syncPosition();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      var open = sections.find(function (section) { return section.dropdown && section.dropdown.classList.contains('uk-open'); });
      if (open) { closeDesktop(); open.anchor.focus({ preventScroll: true }); }
    });
    refresh();
  }

  function refresh() {
    var layout = getComputedStyle(root).getPropertyValue('--shopra-menu-layout').trim().replace(/["']/g, '');
    if (!['gymshark', 'md-fashion'].includes(layout)) return;
    if (!state) { init(); return; }
    if (state.layout === layout) return;
    closeDesktop();
    if (state.layoutController) state.layoutController.abort();
    state.layoutController = new AbortController();
    state.layout = layout;
    root.dataset.shopraMenu = layout;
    state.sections.forEach(function (section, index) {
      if (!section.dropdown) return;
      section.dropdown.replaceChildren();
      section.dropdown.dataset.expanded = 'false';
      if (layout === 'gymshark') buildRails(section, section.dropdown, index);
      else buildColumns(section, section.dropdown);
    });
    state.path = [];
    state.mobileTab = 0;
    if (state.mobile) renderMobile();
    syncPosition();
    document.dispatchEvent(new CustomEvent('shopra:menu-change', { detail: { layout: layout } }));
  }

  function scheduleRefresh() {
    cancelAnimationFrame(refreshFrame);
    refreshFrame = requestAnimationFrame(refresh);
  }

  function bindStylesheets() {
    document.querySelectorAll('link[rel="stylesheet"]').forEach(function (link) {
      if (boundLinks.has(link)) return;
      boundLinks.add(link);
      link.addEventListener('load', scheduleRefresh);
    });
  }

  function boot() {
    if (!UI) return;
    bindStylesheets();
    new MutationObserver(function () { bindStylesheets(); scheduleRefresh(); }).observe(document.head, {
      subtree: true, childList: true, attributes: true, attributeFilter: ['href', 'disabled'], characterData: true
    });
    refresh();
  }

  window.ShopraMenus = { refresh: refresh };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
}());
