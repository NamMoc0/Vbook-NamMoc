// gen.js - Danh sach truyen theo the loai
// Input = URL day du, page = trang
load("config.js");
load("function.js");

function execute(input, page) {
    if (!page) page = "1";
    var api = input + "&page=" + page;
    var response = fetch(api);

    if (response.ok) {
        var json = response.json();
        var storyList = [];

        if (json.data) {
            var items = json.data;
            if (!Array.isArray(items) && items.list) items = items.list;

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (!item.book_id) continue;

                var name = item.book_name || item.title || item.name || "";
                // Link = path only, KHONG co host (giong ban suu tam)
                var link = "/online_detail?book_id=" + item.book_id + "&source=" + item.source + "&tab=" + item.tab;
                link = encodeURIComponent(link);
                var cover = replaceCover(item.thumb_url || item.cover || "");
                var description = item.author || item.auth || "";

                storyList.push({
                    name: name,
                    link: link,
                    cover: cover,
                    description: description,
                    host: BASE_URL
                });
            }
        }

        var next = null;
        if (storyList.length > 0) {
            next = (parseInt(page) + 1).toString();
        }

        return Response.success(storyList, next);
    }

    return Response.error("Không thể tải danh sách truyện.");
}
