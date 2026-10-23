/*
 * SHOPRA icon bridge.
 *
 * UIkit renders uk-icon attributes as inline SVG. CSS still selects the icon
 * theme, while this bridge registers that theme's geometry through the
 * official UIkit.icon.add API. The HTML and uk-icon names never change.
 */
(function () {
  "use strict";

  var targets = ["search", "heart", "user", "settings", "cart"];
  var originals = Object.create(null);
  var ready;
  var started = false;
  var refreshVersion = 0;

  var presetAliases = {
    graphic: "geometric",
    luxury: "atelier",
    monolith: "bold",
    techno: "tech",
    silhouette: "capsule",
    retro: "boutique"
  };

  /* Geometry mirrors the ten icon sketches from the Shopra appearance panel. */
  var iconSets = {
    geometric: {
      search: '<rect x="3.8" y="3.8" width="12.8" height="12.8"></rect><path d="m15.2 15.2 5 5"></path>',
      heart: '<path d="m12 20-8.3-7.6V7.1l2.8-2.8h3L12 7l2.5-2.7h3l2.8 2.8v5.3L12 20Z"></path>',
      user: '<rect x="8.5" y="3.5" width="7" height="7"></rect><path d="M4 20v-3l4-4h8l4 4v3H4Z"></path>',
      filter: '<path d="M3.5 6h17M3.5 12h17M3.5 18h17"></path><rect x="6.5" y="4" width="3" height="4"></rect><rect x="14" y="10" width="3" height="4"></rect><rect x="9.5" y="16" width="3" height="4"></rect>',
      cart: '<path d="m4 9 2 11h12l2-11H4Z"></path><path d="M8 9V5h8v4M7.5 13h9"></path>'
    },
    soft: {
      search: '<circle cx="10.2" cy="10.2" r="6.7"></circle><path d="m15.2 15.2 4.9 4.9"></path>',
      heart: '<path d="M12 20.6S2.8 15.4 2.8 8.8c0-3 2.2-5.1 5-5.1 1.9 0 3.4 1 4.2 2.6.8-1.6 2.3-2.6 4.2-2.6 2.8 0 5 2.1 5 5.1 0 6.6-9.2 11.8-9.2 11.8Z"></path>',
      user: '<circle cx="12" cy="7.6" r="4"></circle><path d="M4.2 20c.3-4.5 3.3-7 7.8-7s7.5 2.5 7.8 7H4.2Z"></path>',
      filter: '<path d="M3.5 6h17M3.5 12h17M3.5 18h17"></path><circle cx="8" cy="6" r="2"></circle><circle cx="15.5" cy="12" r="2"></circle><circle cx="10.5" cy="18" r="2"></circle>',
      cart: '<path d="M3.8 10h16.4l-1.7 8.1c-.2 1.1-1.2 1.9-2.3 1.9H7.8c-1.1 0-2.1-.8-2.3-1.9L3.8 10Z"></path><path d="M7 10a5 5 0 0 1 10 0"></path><path d="M8 14c2.5 1.1 5.5 1.1 8 0"></path>'
    },
    atelier: {
      search: '<ellipse cx="10.2" cy="10.2" rx="6.4" ry="6.8"></ellipse><path d="m14.6 15.1 5.3 5.1"></path>',
      heart: '<path d="M12 20.8C9.8 18.9 4.1 14.4 4.1 8.7 4.1 5.8 5.8 4 8.1 4c1.8 0 3.1 1.2 3.9 3.3.8-2.1 2.1-3.3 3.9-3.3 2.3 0 4 1.8 4 4.7 0 5.7-5.7 10.2-7.9 12.1Z"></path>',
      user: '<ellipse cx="12" cy="7.8" rx="3" ry="3.8"></ellipse><path d="M5.2 20c.6-4 2.9-6.2 6.8-6.2s6.2 2.2 6.8 6.2"></path>',
      filter: '<path d="M4 6h16M4 12h16M4 18h16"></path><circle cx="8" cy="6" r="1.25"></circle><circle cx="15" cy="12" r="1.25"></circle><circle cx="11" cy="18" r="1.25"></circle>',
      cart: '<path d="M6.4 8.5h11.2l-.7 11.2H7.1L6.4 8.5Z"></path><path d="M9.2 8.5V6.8C9.2 4.9 10.2 4 12 4s2.8.9 2.8 2.8v1.7"></path><circle cx="12" cy="13.5" r="1.2"></circle>'
    },
    bold: {
      search: '<circle cx="10" cy="10" r="6.5"></circle><path d="m14.8 14.8 5.4 5.4"></path>',
      heart: '<path d="M12 20.5 4.4 14C.8 10.9 2.6 4 7.4 4c2 0 3.7 1 4.6 2.8C12.9 5 14.6 4 16.6 4c4.8 0 6.6 6.9 3 10L12 20.5Z"></path>',
      user: '<circle cx="12" cy="7.5" r="3.6"></circle><path d="M4.3 20c.5-4.7 3.2-7 7.7-7s7.2 2.3 7.7 7"></path>',
      filter: '<path d="M3.5 6h17M3.5 12h17M3.5 18h17"></path><path d="M8 3.8v4.4M16 9.8v4.4M10 15.8v4.4"></path>',
      cart: '<path d="M3.5 10h17l-2 10h-13l-2-10Z"></path><path d="M7 10a5 5 0 0 1 10 0M8 14h8"></path>'
    },
    minimal: {
      search: '<circle cx="10.5" cy="10.5" r="5.8"></circle><path d="m14.8 14.8 4.7 4.7"></path>',
      heart: '<path d="M20 6c-2-2-5.5-1.3-8 1.7C9.5 4.7 6 4 4 6c-2.3 2.3-.9 6 1.2 8.1 2 2 4.3 3.8 6.8 5.5 2.5-1.7 4.8-3.5 6.8-5.5C20.9 12 22.3 8.3 20 6Z"></path>',
      user: '<circle cx="12" cy="8" r="3.1"></circle><path d="M5.5 19.8c.8-3.7 3-5.7 6.5-5.7s5.7 2 6.5 5.7"></path>',
      filter: '<path d="M4 6h16M7 12h10M10 18h4"></path>',
      cart: '<path d="M6 6.5h12v13H6v-13Z"></path><path d="M9 9V7a3 3 0 0 1 6 0v2"></path>'
    },
    tech: {
      search: '<path d="M10.5 3.5h3.2l3.8 3.8v6.4l-3.8 3.8H7.3l-3.8-3.8V7.3"></path><path d="m15.4 15.4 5.1 5.1"></path>',
      heart: '<path d="M12 20.5 4 13V7l3-3 5 4.2L17 4l3 3v6l-8 7.5Z" stroke-dasharray="5 1.7"></path>',
      user: '<path d="M9 3.5h6l2 2v4l-2 2H9l-2-2v-4l2-2Z"></path><path d="M4 20v-3l4-4h8l4 4v3" stroke-dasharray="5 1.8"></path>',
      filter: '<path d="M3.5 6h3M11 6h9.5M3.5 12h9M17 12h3.5M3.5 18h5M12.5 18h8"></path><path d="M7 4v4M13 10v4M9 16v4"></path>',
      cart: '<path d="m4 7.5 8-4 8 4v9l-8 4-8-4v-9Z" stroke-dasharray="7 1.5"></path><path d="m4 7.5 8 4 8-4M12 11.5v9M8 5.5l8 4"></path>'
    },
    organic: {
      search: '<path d="M16.7 10.1c0 3.7-2.3 6.7-6.4 6.7-3.8 0-6.7-2.5-6.7-6.5 0-3.8 2.7-6.8 6.8-6.8 3.8 0 6.3 2.8 6.3 6.6Z"></path><path d="M15 15c2 1.2 3.6 3 5.2 5.1"></path>',
      heart: '<path d="M12.1 20.4C9.5 18.2 3.2 14.8 3.4 8.6 3.5 5.8 5.5 4 8 4.1c2 .1 3.2 1.3 4 3 1.1-1.7 2.5-2.8 4.4-2.7 2.7.1 4.4 2.3 4.1 5-.7 5.4-5.6 8.7-8.4 11Z"></path>',
      user: '<path d="M15.6 7.6c0 2.3-1.5 3.9-3.7 3.8-2.1-.1-3.6-1.7-3.5-4 .1-2.2 1.6-3.8 3.8-3.7 2.1.1 3.5 1.7 3.4 3.9Z"></path><path d="M4.8 19.8c1.1-4.1 3.4-6.3 7.2-6.1 3.9.2 6.2 2.4 7.2 6.1"></path>',
      filter: '<path d="M3.5 6.2c4.5-.6 12.5-.5 17 0M3.5 12c5 .5 12 .4 17 0M3.5 17.8c5-.5 12-.4 17 0"></path><circle cx="8" cy="6" r="1.5"></circle><circle cx="15.5" cy="12" r="1.5"></circle><circle cx="10.5" cy="18" r="1.5"></circle>',
      cart: '<path d="M4 10c1 3.5 1.7 6.9 2.7 9.8 3.5.5 7.1.5 10.6 0 1-3 1.8-6.4 2.7-9.8H4Z"></path><path d="M7.2 10C7.7 6 9.3 4 12 4s4.3 2 4.8 6M6 14c3.7 1.2 8.3 1.2 12 0M8 10l1.2 10M16 10l-1.2 10"></path>'
    },
    classic: {
      search: '<circle cx="9.8" cy="9.8" r="6.2"></circle><path d="m14.3 14.3 6 6"></path>',
      heart: '<path d="M20.5 5.8c-2.2-2.3-6-1.3-8.5 1.8C9.5 4.5 5.7 3.5 3.5 5.8 1 8.5 2.6 12.7 5 15c2 2 4.5 3.8 7 5.5 2.5-1.7 5-3.5 7-5.5 2.4-2.3 4-6.5 1.5-9.2Z"></path>',
      user: '<circle cx="12" cy="7" r="3.4"></circle><path d="M4 20h16c-.7-4.5-3.4-7-8-7s-7.3 2.5-8 7Z"></path>',
      filter: '<path d="M3.5 5h17l-6.2 7.2v5.4l-4.6 2v-7.4L3.5 5Z"></path>',
      cart: '<path d="M2.8 4.5h2l2.1 10.2h10.8l2.1-7.3H5.5"></path><circle cx="8.2" cy="19" r="1.3"></circle><circle cx="17" cy="19" r="1.3"></circle>'
    },
    capsule: {
      search: '<path d="M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Zm0 4a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z" fill="currentColor" fill-rule="evenodd" stroke="none"></path><path d="m15.2 15.2 5.1 5.1" stroke="currentColor" stroke-width="3.2"></path>',
      heart: '<path d="M12 21 4.2 14.5C.8 11.7 2.3 4 7.4 4c2 0 3.7 1.2 4.6 3 1-1.8 2.6-3 4.6-3 5.1 0 6.6 7.7 3.2 10.5L12 21Z" fill="currentColor" stroke="none"></path>',
      user: '<circle cx="12" cy="7.2" r="4.1" fill="currentColor" stroke="none"></circle><path d="M3.8 20.5c.5-5.1 3.4-7.7 8.2-7.7s7.7 2.6 8.2 7.7H3.8Z" fill="currentColor" stroke="none"></path>',
      filter: '<path d="M3.5 4.5h17v3h-17v-3Zm0 6h17v3h-17v-3Zm0 6h17v3h-17v-3Z" fill="currentColor" stroke="none"></path><circle cx="8" cy="6" r="2.5" fill="currentColor" stroke="none"></circle><circle cx="15" cy="12" r="2.5" fill="currentColor" stroke="none"></circle><circle cx="10" cy="18" r="2.5" fill="currentColor" stroke="none"></circle>',
      cart: '<path d="M4 9h16l-1.8 11H5.8L4 9Z" fill="currentColor" stroke="none"></path><path d="M8 9a4 4 0 0 1 8 0" stroke="currentColor" stroke-width="3"></path>'
    },
    boutique: {
      search: '<circle cx="10" cy="10" r="6.2"></circle><path d="m14.5 14.5 5.8 5.8M6 4.9c2.5-1.7 5.5-1.7 8 0"></path>',
      heart: '<path d="M12 20.2S3.2 15 3.2 8.9c0-2.9 2-4.9 4.8-4.9 1.8 0 3.2.9 4 2.4.8-1.5 2.2-2.4 4-2.4 2.8 0 4.8 2 4.8 4.9 0 6.1-8.8 11.3-8.8 11.3Z"></path>',
      user: '<circle cx="12" cy="7.5" r="3.7"></circle><path d="M4.5 20c.5-4.4 3.1-6.7 7.5-6.7s7 2.3 7.5 6.7"></path><path d="M9.5 7.5h.1M14.4 7.5h.1"></path>',
      filter: '<path d="M4 6h16M4 12h16M4 18h16"></path><circle cx="8" cy="6" r="2"></circle><circle cx="15" cy="12" r="2"></circle><circle cx="11" cy="18" r="2"></circle>',
      cart: '<path d="M5 4h2l2 11h9.5l1-7H8"></path><path d="M9 8h10.5M9 11.5H19"></path><circle cx="10" cy="19" r="1.5"></circle><circle cx="17.5" cy="19" r="1.5"></circle>'
    }
  };

  function clean(value) {
    return value.trim().replace(/^['"]|['"]$/g, "");
  }

  function readTheme() {
    var style = getComputedStyle(document.documentElement);
    var requested = clean(style.getPropertyValue("--shopra-icon-set"));
    var preset = presetAliases[requested] || requested;
    var sources = {};

    targets.forEach(function (target) {
      var value = clean(style.getPropertyValue("--shopra-icon-source-" + target));
      sources[target] = value || target;
    });

    return {
      preset: iconSets[preset] ? preset : "",
      requestedPreset: requested,
      sources: sources
    };
  }

  function makeSvg(children) {
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + children + "</svg>";
  }

  async function readUikitIcon(name) {
    if (originals[name]) {
      return originals[name];
    }

    var element = document.createElement("span");
    var component = UIkit.icon(element, { icon: name });

    try {
      var svg = await component.getSvg();
      svg.setAttribute("width", "20");
      svg.setAttribute("height", "20");
      originals[name] = svg.outerHTML;
      return originals[name];
    } finally {
      if (component && component.$destroy) {
        component.$destroy();
      }
    }
  }

  async function cacheOriginalTargets() {
    await Promise.all(targets.map(readUikitIcon));
  }

  async function refresh() {
    if (!window.UIkit || !UIkit.icon || !UIkit.icon.add) {
      return;
    }

    var version = ++refreshVersion;
    await ready;

    var theme = readTheme();
    var replacements = {};
    var selection = {};

    if (theme.preset) {
      var preset = iconSets[theme.preset];
      targets.forEach(function (target) {
        var source = target === "settings" ? "filter" : target;
        replacements[target] = makeSvg(preset[source]);
        selection[target] = theme.preset + ":" + source;
      });
    } else {
      await Promise.all(targets.map(async function (target) {
        replacements[target] = await readUikitIcon(theme.sources[target]);
        selection[target] = theme.sources[target];
      }));
    }

    if (version !== refreshVersion) {
      return;
    }

    UIkit.icon.add(replacements);
    document.documentElement.dataset.shopraIconSet = theme.preset || "uikit";
    document.dispatchEvent(new CustomEvent("shopra:icons:changed", {
      detail: {
        preset: theme.preset || "uikit",
        selection: selection
      }
    }));
  }

  function scheduleRefresh(link) {
    if (link && link.tagName === "LINK" && String(link.rel).includes("stylesheet")) {
      link.addEventListener("load", refresh, { once: true });
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(refresh);
    });
  }

  function observeThemeStylesheets() {
    var observer = new MutationObserver(function (records) {
      records.forEach(function (record) {
        if (record.type === "attributes") {
          scheduleRefresh(record.target);
          return;
        }

        record.addedNodes.forEach(function (node) {
          scheduleRefresh(node);
        });
      });
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["href", "media", "disabled"]
    });
  }

  function start() {
    if (started) {
      return;
    }

    started = true;
    ready = cacheOriginalTargets();
    observeThemeStylesheets();
    refresh();
  }

  window.ShopraIcons = {
    refresh: refresh,
    getSelection: readTheme
  };

  document.addEventListener("shopra:icons:refresh", refresh);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
}());
