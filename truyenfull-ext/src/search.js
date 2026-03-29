// search.js - Tim kiem truyen tren tat ca nguon (Tong hop)
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

        // Xac dinh source cua ket qua tim kiem
        var itemSource = item.source || "推荐";

        var fakeLink = "https://api.langge.cf/book_render?id=" + encodeURIComponent(item.book_id || "")
                       + "&source=" + encodeURIComponent(itemSource);

        var desc = "";
        if (item.auth) desc = desc + item.auth;
        if (item.source) desc = desc + " [" + item.source + "]";
        if (item.state_str) desc = desc + " | " + item.state_str;

        novels.push({
            name: item.title || item.name || "Khong co ten",
            link: fakeLink,
            cover: item.cover || "",
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
