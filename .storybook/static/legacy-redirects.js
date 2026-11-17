// Old Storybook addresses, and where each one lives now.
//
// On 17 Nov 2026 the sidebar was regrouped into six folders (Start Here, Prototypes,
// Design System, Reviews, Research, Archive). Every story kept its old id (each story
// file sets `id` to the id it had before), so story links already shared in Linear and
// Slack still work untouched. MDX docs pages can't pin an id, so the ones that moved
// are listed here. Loaded on every page (see manager-head.html and preview-head.html);
// it does nothing unless the address asks for one of the ids below.
(function () {
    var MOVED = {
        "introduction--docs": "start-here-overview--docs",
        "foundations-data-visualization--docs": "design-system-styles-data-visualization--docs",
    };
    var url = new URL(window.location.href);
    var path = url.searchParams.get("path");
    var id = path ? path.split("/")[2] : url.searchParams.get("id");
    var to = id && Object.prototype.hasOwnProperty.call(MOVED, id) ? MOVED[id] : null;
    if (!to) return;
    var search = window.location.search;
    if (path) {
        search = search.replace(/([?&]path=)[^&]*/, "$1/docs/" + to);
    } else {
        search = search.replace(/([?&]id=)[^&]*/, "$1" + to);
    }
    // Runs before Storybook reads the address, so it simply opens on the new page.
    window.history.replaceState(null, "", window.location.pathname + search + window.location.hash);
})();
