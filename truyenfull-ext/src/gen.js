// gen.js - Phân trang danh sách truyện của thể loại Nguồn
// Input = chuỗi JSON, page = trang
function execute(input, page) {
    if (!page) page = "1";
    var p = parseInt(page);

    var data;
    try {
        data = JSON.parse(input);
    } catch (e) {
        return Response.error("Dữ liệu đầu vào gen bị lỗi: " + e);
    }

    var urlFetch = "";

    if (data.is_special === false) {
        // Dạng 1: Các trang nguồn nhỏ (url đã là base64 trả về từ list)
        urlFetch = "https://api.langge.cf/discovedata?url=" + encodeURIComponent(data.url)
                   + "&source=" + encodeURIComponent(data.source)
                   + "&page=" + p
                   + "&tab=" + encodeURIComponent("小说");
    } else {
        // Dạng 2: Web lớn như Fanqie, Qidian - dùng /get_discover
        var gender = data.gender || "1";
        // bdtype = 1,2,3,4. Nhưng thực tế param API của Langge yêu cầu `bdtype` hoặc không.
        // Ta sử dụng đúng `is_ranking=1` và `gender`.
        urlFetch = "https://api.langge.cf/get_discover?source=" + encodeURIComponent(data.source)
                   + "&tab=" + encodeURIComponent("小说")
                   + "&gender=" + gender
                   + "&is_ranking=1&page=" + p;
    }

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
        if (json.data.list) {
            bookList = json.data.list;
        } else if (Array.isArray(json.data)) {
            bookList = json.data;
        }
    }

    if (!bookList || bookList.length === 0) {
        if (p > 1) {
            return Response.success([]);
        }
        return Response.error("Không tìm thấy truyện nào từ nguồn " + data.source);
    }

    var novels = [];
    for (var i = 0; i < bookList.length; i++) {
        var item = bookList[i];
        // Link ảo để truyền book_id (nhiều nguồn lưu book_id là Base64) và source cho detail.js
        var fakeLink = "https://api.langge.cf/book_render?id=" + encodeURIComponent(item.book_id || "")
                       + "&source=" + encodeURIComponent(data.source);

        var desc = "";
        if (item.auth) desc = desc + item.auth;
        if (item.state_str) desc = desc + " | " + item.state_str;
        if (item.category) desc = desc + " | " + item.category;

        novels.push({
            name: item.title || item.name || "Không có tên",
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
