// gen.js - Phan trang danh sach truyen
// Input = URL day du toi API get_discover (truyen tu home.js)
load("utils.js");
function execute(input, page) {
    if (!page) page = "1";

    // Ghép thêm tham số page vào URL có sẵn
    var urlFetch = input + "&page=" + page;

    var res = fetch(urlFetch, {
        headers: {
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36"
        }
    });

    if (!res.ok) {
        return Response.error("Lỗi lấy danh sách truyện (HTTP " + res.status + ")");
    }

    var json = res.json();
    var bookList = null;
    if (json && json.data) {
        if (Array.isArray(json.data)) {
            bookList = json.data;
        } else if (json.data.list) {
            bookList = json.data.list;
        }
    }

    if (!bookList || bookList.length === 0) {
        if (parseInt(page) > 1) return Response.success([]);
        return Response.error("Không tìm thấy truyện nào.");
    }

    // Lay source tu URL de truyen sang detail.js
    var sourceMatch = input.match(/[?&]source=([^&]+)/);
    var source = sourceMatch ? decodeURIComponent(sourceMatch[1]) : "推荐";

    var novels = [];
    for (var i = 0; i < bookList.length; i++) {
        var item = bookList[i];

        // Link ao de truyen book_id va source sang detail.js / toc.js
        // Dung source tu item (co the la "svip_QQ阅读" hoac "番茄" v.v.)
        var itemSource = item.source || source;
        var itemTab = item.tab || "\u5c0f\u8bf4";

        // Bo qua item khong co book_id hop le
        if (!item.book_id) continue;

        var fakeLink = "https://api.langge.cf/online_detail?book_id=" + encodeURIComponent(item.book_id)
                       + "&source=" + encodeURIComponent(itemSource)
                       + "&tab=" + encodeURIComponent(itemTab);

        var desc = item.author || item.auth || "";
        if (item.state_str) desc = desc + " | " + item.state_str;
        if (item.category) desc = desc + " | " + item.category;

        novels.push({
            name: item.book_name || item.title || item.name || "Không có tên",
            link: fakeLink,
            cover: replaceCover(item.thumb_url || item.cover || ""),
            description: desc,
            host: "https://api.langge.cf"
        });
    }

    var next = novels.length > 0 ? String(parseInt(page) + 1) : null;
    return Response.success(novels, next);
}
