// toc.js - Lay muc luc (danh sach chuong) cua truyen
// URL dang: https://api.langge.cf/online_detail?book_id=...&source=...&tab=...
function getParam(url, name) {
    var match = url.match(new RegExp("[?&]" + name + "=([^&]+)"));
    return match ? decodeURIComponent(match[1]) : "";
}

function execute(url) {
    url = decodeURIComponent(url);
    var bookId = getParam(url, "book_id");
    var source = getParam(url, "source") || "推荐";
    var tab    = getParam(url, "tab")    || "小说";

    if (!bookId) return Response.error("Khong tim thay book_id");

    // Goi API catalog
    var apiUrl = "https://api.langge.cf/catalog?book_id=" + encodeURIComponent(bookId)
                 + "&source=" + encodeURIComponent(source)
                 + "&tab="    + encodeURIComponent(tab);

    var res = fetch(apiUrl, {
        headers: {
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36"
        }
    });

    if (!res.ok) {
        return Response.error("Loi lay muc luc (HTTP " + res.status + ")");
    }

    var json = res.json();

    // API co the tra ve json.data la mang chuong
    var chapList = null;
    if (json && json.data) {
        if (Array.isArray(json.data)) {
            chapList = json.data;
        } else if (json.data.list) {
            chapList = json.data.list;
        } else if (json.data.chapters) {
            chapList = json.data.chapters;
        }
    }

    if (!chapList || chapList.length === 0) {
        return Response.error("Khong tim thay muc luc chuong");
    }

    var toc = [];
    for (var i = 0; i < chapList.length; i++) {
        var chap = chapList[i];
        // Tao URL ao cho chap.js: dung source va tab tu item (giong plugin_2)
        var chapSource = chap.source || source;
        var chapTab    = chap.tab    || tab;
        var chapUrl = "https://api.langge.cf/online_reader?book_id=" + encodeURIComponent(bookId)
                      + "&source=" + encodeURIComponent(chapSource)
                      + "&tab="    + encodeURIComponent(chapTab)
                      + "&item_id=" + encodeURIComponent(chap.item_id || chap.id || "");

        toc.push({
            name: chap.title || chap.name || ("Chuong " + (i + 1)),
            url: chapUrl,
            host: "https://api.langge.cf"
        });
    }

    return Response.success(toc);
}
