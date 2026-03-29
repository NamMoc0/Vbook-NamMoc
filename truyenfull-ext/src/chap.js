// chap.js - Lay noi dung chuong truyen
// URL dang: https://api.langge.cf/chap_render?item_id={id}&source={source}
function execute(url) {
    // Parse item_id va source tu URL ao
    var itemId = "";
    var source = "";

    try {
        var queryStr = url.split("?")[1] || "";
        var params = queryStr.split("&");
        for (var i = 0; i < params.length; i++) {
            var kv = params[i].split("=");
            if (kv[0] === "item_id") itemId = decodeURIComponent(kv[1] || "");
            if (kv[0] === "source") source = decodeURIComponent(kv[1] || "");
        }
    } catch (e) {
        return Response.error("Loi parse URL chuong: " + e);
    }

    if (!itemId) return Response.error("Khong tim thay item_id chuong");
    if (!source) source = "推荐";

    // Goi API content bang POST
    var apiUrl = "https://api.langge.cf/content?review=1";
    var bodyData = JSON.stringify({
        item_id: itemId,
        source: source,
        tab: "小说",
        version: "4.11.5.1"
    });

    var res = fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36"
        },
        body: bodyData
    });

    if (!res.ok) {
        return Response.error("Loi lay noi dung chuong (HTTP " + res.status + ")");
    }

    var json = res.json();

    // Lay noi dung text tu response
    var content = "";
    if (json && json.data) {
        if (typeof json.data === "string") {
            content = json.data;
        } else if (json.data.content) {
            content = json.data.content;
        } else if (json.data.text) {
            content = json.data.text;
        }
    }

    if (!content || content.trim() === "") {
        return Response.error("Noi dung chuong rong. Co the can dang nhap.");
    }

    // Chuyen newline thanh the HTML <br> de hien thi tot tren vBook
    // Loai bo cac ky tu thua
    content = content.replace(/\r\n/g, "\n");
    content = content.replace(/\n{3,}/g, "\n\n");
    content = content.replace(/\n/g, "<br>");

    // Boc trong the <p> de dinh dang dep hon
    content = "<div style='line-height:1.8;font-size:16px;'>" + content + "</div>";

    return Response.success(content);
}
