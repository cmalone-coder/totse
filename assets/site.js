// Randomizes the banner slots and Hot Topics box on every page load.
// Banners are real images recovered from the archive, shown for nostalgia
// only - no tracking, no live network calls, nothing server-side.
// Hot Topics links point at the actual rebuilt thread pages in this site
// (community/threads/) - the manifest itself is generated from the real
// build output, so every entry here genuinely exists.

function pickRandom(arr, n) {
    const pool = arr.slice();
    const picked = [];
    while (pool.length && picked.length < n) {
        const i = Math.floor(Math.random() * pool.length);
        picked.push(pool.splice(i, 1)[0]);
    }
    return picked;
}

document.addEventListener("DOMContentLoaded", function () {
    // SITE_PREFIX (e.g. "../../../") is injected per-page by totse_template.py
    // so this script works correctly regardless of how deep the page sits in
    // the site's folder structure - without it, every path here would only
    // resolve correctly for pages sitting at the site root.
    const prefix = (typeof SITE_PREFIX !== "undefined") ? SITE_PREFIX : "";

    // Top banner
    const topSlot = document.getElementById("banner-slot-top");
    if (topSlot && typeof RECOVERED_BANNERS !== "undefined" && RECOVERED_BANNERS.length) {
        const pick = pickRandom(RECOVERED_BANNERS, 1)[0];
        topSlot.src = prefix + pick;
        topSlot.style.display = "";
    }

    // Two sidebar mini-banners
    if (typeof RECOVERED_MINIBANNERS !== "undefined" && RECOVERED_MINIBANNERS.length) {
        const picks = pickRandom(RECOVERED_MINIBANNERS, 2);
        const slot1 = document.getElementById("banner-slot-mini-1");
        const slot2 = document.getElementById("banner-slot-mini-2");
        if (slot1 && picks[0]) { slot1.src = prefix + picks[0]; slot1.style.display = ""; }
        if (slot2 && picks[1]) { slot2.src = prefix + picks[1]; slot2.style.display = ""; }
    }

    // Hot Topics: 10 random real threads from the archive. Links point at the
    // raw archived pages (Totse/www.totse.com/community/...), which sits one
    // level above the site root (Totse/_site/...) - hence the extra "../".
    const hotList = document.getElementById("hot-topics-list");
    if (hotList && typeof HOT_TOPICS !== "undefined" && HOT_TOPICS.length) {
        const picks = pickRandom(HOT_TOPICS, 10);
        picks.forEach(function (t) {
            const href = prefix + "community/threads/" + t.file;
            const row = document.createElement("tr");
            row.setAttribute("valign", "top");
            row.innerHTML =
                '<td align="right"><a href="' + href + '" style="text-decoration:none" target="_top">' +
                '<img src="' + prefix + 'images/bullets/hot_topic_bullet.gif" border="0"></a></td>' +
                '<td align="left"><a href="' + href + '" style="text-decoration:none" target="_top" class="hottext">' +
                escapeHtml(t.title) + '</a></td>';
            hotList.appendChild(row);
        });
    }
});

function escapeHtml(s) {
    const d = document.createElement("div");
    d.innerText = s;
    return d.innerHTML;
}
