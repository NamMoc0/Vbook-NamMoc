// detail.js - Lay thong tin chi tiet truyen
// URL dang: https://api.langge.cf/online_detail?book_id=...&source=...&tab=...
load("utils.js");
function getParam(url, name) {
    var match = url.match(new RegExp("[?&]" + name + "=([^&]+)"));
    return match ? decodeURIComponent(match[1]) : "";
}

function execute(url) {
    url = decodeURIComponent(url);
    var bookId = getParam(url, "book_id");
    var source = getParam(url, "source") || "推荐";
    var tab    = getParam(url, "tab")    || "小说";

    if (!bookId) {
        return Response.error("Khong tim thay book_id trong URL");
    }
    if (!source) source = "推荐";

    // Goi API detail (dung field book_id truc tiep, khong phai ?id=)
    var apiUrl = "https://api.langge.cf/detail?book_id=" + encodeURIComponent(bookId)
                 + "&source=" + encodeURIComponent(source)
                 + "&tab="    + encodeURIComponent(tab);

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
    var currentStatus = d.status || d.state_str || "";
    if (currentStatus) {
        var stateStr = currentStatus.toLowerCase();
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
    var currentAuthor = d.author || d.auth || "";
    if (currentAuthor) {
        suggests.push({
            title: "Cùng tác giả: " + currentAuthor,
            input: currentAuthor,
            script: "search.js"
        });
    }

    var chiTietDong = "Nguồn: " + source;
    if (d.word_number || d.word_count) chiTietDong += " | " + (d.word_number || d.word_count);
    if (currentStatus) chiTietDong += " | " + currentStatus;

    var result = {
        name: d.book_name || d.title || d.name || "Không có tên",
        cover: replaceCover(d.thumb_url || d.cover || ""),
        host: "https://api.langge.cf",
        author: currentAuthor,
        description: d.abstract || d.desc || d.description || d.intro || "",
        detail: chiTietDong,
        ongoing: ongoing,
        genres: genres,
        suggests: suggests
    };

    return Response.success(result);
}
