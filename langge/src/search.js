// search.js - Tim kiem truyen
load("config.js");
load("function.js");

function execute(key, page) {
    if (!page) page = "1";
    var api = BASE_URL + "/search?"
        + "title=" + key
        + "&source=" + "番茄"
        + "&tab=" + "小说"
        + "&page=" + page;
    var response = fetch(api);

    if (response.ok) {
        var json = response.json();
        var storyList = [];

        if (json.data) {
            var items = json.data;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (!item.book_id) continue;

                var name = item.book_name || item.title || item.name || "";
                // Link = query only (giong ban suu tam search.js)
                var link = "?book_id=" + item.book_id + "&source=" + item.source + "&tab=" + item.tab;
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

            var next = null;
            if (parseInt(page) <= 3) {
                next = (parseInt(page) + 1).toString();
            }

            return Response.success(storyList, next);
        }
    }

    return Response.error("Không tìm thấy kết quả.");
}
