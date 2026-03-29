// toc.js - Muc luc (danh sach chuong)
load("config.js");
load("function.js");

function execute(input) {
    var book_id = getParam(input, "book_id");
    var source = getParam(input, "source");
    var tab = getParam(input, "tab");

    var api = BASE_URL + "/catalog?"
        + "book_id=" + book_id
        + "&source=" + source
        + "&tab=" + tab;
    var response = fetch(api);

    if (response.ok) {
        var json = response.json();
        var chapList = [];

        if (json.data) {
            var items = json.data;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var name = item.title || item.name || ("Chuong " + (i + 1));
                // Link = path only, KHONG co host (giong ban suu tam)
                var link = "/online_reader?book_id=" + book_id
                    + "&source=" + item.source
                    + "&tab=" + item.tab
                    + "&item_id=" + item.item_id;
                chapList.push({
                    name: name,
                    url: link,
                    host: BASE_URL
                });
            }
        }

        return Response.success(chapList);
    }

    return Response.error("Không thể tải danh sách chương.");
}
