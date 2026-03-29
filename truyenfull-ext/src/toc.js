// toc.js - Lay muc luc (danh sach chuong) cua truyen
// URL dang: https://api.langge.cf/book_render?id={base64}&source={source}
function execute(url) {
    // Parse book_id va source tu URL ao
    var bookId = "";
    var source = "";

    try {
        var queryStr = url.split("?")[1] || "";
        var params = queryStr.split("&");
        for (var i = 0; i < params.length; i++) {
            var kv = params[i].split("=");
            if (kv[0] === "id") bookId = decodeURIComponent(kv[1] || "");
            if (kv[0] === "source") source = decodeURIComponent(kv[1] || "");
        }
    } catch (e) {
        return Response.error("Loi parse URL: " + e);
    }

    if (!bookId) return Response.error("Khong tim thay book_id");
    if (!source) source = "推荐";

    // Goi API catalog
    var apiUrl = "https://api.langge.cf/catalog?book_id=" + encodeURIComponent(bookId)
                 + "&source=" + encodeURIComponent(source)
                 + "&tab=" + encodeURIComponent("小说");

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
        // Tao URL ao cho chap.js: chua item_id va source
        var chapUrl = "https://api.langge.cf/chap_render?item_id=" + encodeURIComponent(chap.item_id || chap.id || "")
                      + "&source=" + encodeURIComponent(source);

        toc.push({
            name: chap.title || chap.name || ("Chuong " + (i + 1)),
            url: chapUrl,
            host: "https://api.langge.cf"
        });
    }

    return Response.success(toc);
}
