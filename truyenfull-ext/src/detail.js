// detail.js - Lay thong tin chi tiet truyen
// URL dang: https://api.langge.cf/book_render?id={base64}&source={source}
function execute(url) {
    // Parse book_id va source tu URL ao
    var bookId = "";
    var source = "";

    try {
        // Tach query params tu URL
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

    if (!bookId) {
        return Response.error("Khong tim thay book_id trong URL");
    }
    if (!source) source = "推荐";

    // Goi API detail
    var apiUrl = "https://api.langge.cf/detail?book_id=" + encodeURIComponent(bookId)
                 + "&source=" + encodeURIComponent(source)
                 + "&tab=" + encodeURIComponent("小说");

    var res = fetch(apiUrl, {
        headers: {
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36"
        }
    });

    if (!res.ok) {
        return Response.error("Loi lay chi tiet truyen (HTTP " + res.status + ")");
    }

    var json = res.json();
    if (!json || !json.data) {
        return Response.error("Du lieu chi tiet truyen rong");
    }

    var d = json.data;

    // Xac dinh trang thai: ongoing = true (dang ra), false (hoan thanh)
    var ongoing = true;
    if (d.state_str) {
        var stateStr = d.state_str.toLowerCase();
        if (stateStr.indexOf("完") >= 0 || stateStr.indexOf("finish") >= 0 || stateStr.indexOf("hoan") >= 0) {
            ongoing = false;
        }
    }

    // Tao danh sach the loai (genres) - cho phep bam vao de xem the loai do
    var genres = [];
    if (d.category) {
        var cats = d.category.split(",");
        for (var j = 0; j < cats.length; j++) {
            var catName = cats[j].trim();
            if (catName) {
                genres.push({
                    title: catName,
                    input: catName,
                    script: "search.js"
                });
            }
        }
    }

    // Tao danh sach goi y (suggests) - tim truyen cung tac gia
    var suggests = [];
    if (d.auth) {
        suggests.push({
            title: "Cùng tác giả: " + d.auth,
            input: d.auth,
            script: "search.js"
        });
    }

    var result = {
        name: d.title || d.name || "Khong co ten",
        cover: d.cover || "",
        host: "https://api.langge.cf",
        author: d.auth || d.author || "",
        description: d.desc || d.description || d.intro || "",
        detail: "Nguon: " + source + " | " + (d.word_count || "") + " | " + (d.state_str || ""),
        ongoing: ongoing,
        genres: genres,
        suggests: suggests
    };

    return Response.success(result);
}
