// search.js - Tim kiem truyen tren tat ca nguon (Tong hop)
load("utils.js");
function execute(key, page) {
    if (!key || key.trim() === "") {
        return Response.error("Vui long nhap tu khoa tim kiem");
    }
    if (!page) page = "1";
    var p = parseInt(page);

    // source=推荐 nghia la tim kiem tren tat ca nguon (goi y)
    var url = "https://api.langge.cf/search?title=" + encodeURIComponent(key)
              + "&source=" + encodeURIComponent("推荐")
              + "&tab=" + encodeURIComponent("小说")
              + "&page=" + p;

    var res = fetch(url, {
        headers: {
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36"
        }
    });

    if (!res.ok) {
        return Response.error("Loi tim kiem (HTTP " + res.status + ")");
    }

    var json = res.json();

    // API tra ve json.data la mang ket qua
    var bookList = null;
    if (json && json.data) {
        if (Array.isArray(json.data)) {
            bookList = json.data;
        } else if (json.data.list) {
            bookList = json.data.list;
        }
    }

    if (!bookList || bookList.length === 0) {
        if (p > 1) return Response.success([]);
        return Response.error("Khong tim thay truyen voi tu khoa: " + key);
    }

    var novels = [];
    for (var i = 0; i < bookList.length; i++) {
        var item = bookList[i];

        // Bo qua item khong co book_id hop le
        if (!item.book_id) continue;

        // Dung source tu item (giu nguyen svip_ prefix neu co)
        var itemSource = item.source || "推荐";
        var itemTab    = item.tab    || "小说";

        var fakeLink = "https://api.langge.cf/online_detail?book_id=" + encodeURIComponent(item.book_id)
                       + "&source=" + encodeURIComponent(itemSource)
                       + "&tab="    + encodeURIComponent(itemTab);

        var desc = item.author || item.auth || "";
        if (item.source)    desc = desc + (desc ? " [" : "[") + item.source + "]";
        if (item.state_str) desc = desc + " | " + item.state_str;
        if (item.category)  desc = desc + " | " + item.category;

        novels.push({
            name: item.book_name || item.title || item.name || "Khong co ten",
            link: fakeLink,
            cover: replaceCover(item.thumb_url || item.cover || ""),
            description: desc,
            host: "https://api.langge.cf"
        });
    }

    var next = null;
    if (novels.length > 0) {
        next = String(p + 1);
    }

    return Response.success(novels, next);
}
