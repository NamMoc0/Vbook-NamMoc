// detail.js - Chi tiet truyen
load("config.js");
load("function.js");

function execute(input) {
    input = decodeURIComponent(input);
    var book_id = getParam(input, "book_id");
    var source = getParam(input, "source");
    var tab = getParam(input, "tab");

    var api = BASE_URL + "/detail?"
        + "book_id=" + book_id
        + "&source=" + source
        + "&tab=" + tab;
    var response = fetch(api);

    if (response.ok) {
        var json = response.json();

        if (json.data) {
            var name = json.data.book_name || json.data.title || "";
            var author = json.data.author || json.data.auth || "";
            var cover = replaceCover(json.data.thumb_url || json.data.cover || "");
            var detail = "";
            if (json.data.score) detail += "评分: " + json.data.score + "<br>";
            if (json.data.word_number) detail += "字数: " + json.data.word_number + "<br>";
            if (json.data.category) detail += "分类: " + json.data.category + "<br>";
            if (json.data.last_chapter_update_time) detail += "最后更新: " + json.data.last_chapter_update_time;
            var description = (json.data.abstract || json.data.desc || json.data.description || "").replace(/\r?\n/g, "<br>");
            var ongoing = true;
            if (json.data.status && json.data.status.indexOf("已完结") >= 0) ongoing = false;

            return Response.success({
                name: name,
                author: author,
                cover: cover,
                detail: detail,
                description: description,
                ongoing: ongoing,
                host: BASE_URL
            });
        }
    }

    return Response.error("Không thể tải thông tin truyện.");
}
