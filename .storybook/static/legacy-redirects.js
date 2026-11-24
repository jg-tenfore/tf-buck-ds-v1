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
        // Nov 24: Layout A was picked, so Layout B left Prototypes; it lives on in Reviews › Nov 11.
        "nov-17-2026-bay-sheet--concept-b": "/story/nov-11-2026-bay-sheet--concept-b",
        "nov-17-2026-bay-sheet--extend-tab": "/story/nov-17-2026-bay-sheet--extend",
    };
    var url = new URL(window.location.href);
    var path = url.searchParams.get("path");
    var id = path ? path.split("/")[2] : url.searchParams.get("id");
    var to = id && Object.prototype.hasOwnProperty.call(MOVED, id) ? MOVED[id] : null;
    if (!to) return;
    var search = window.location.search;
    if (path) {
        // A value starting with "/" is a full path (stories); a bare id is a docs page.
        search = search.replace(/([?&]path=)[^&]*/, "$1" + (to.charAt(0) === "/" ? to : "/docs/" + to));
    } else {
        search = search.replace(/([?&]id=)[^&]*/, "$1" + to.replace(/^\/(story|docs)\//, ""));
    }
    // Runs before Storybook reads the address, so it simply opens on the new page.
    window.history.replaceState(null, "", window.location.pathname + search + window.location.hash);
})();
