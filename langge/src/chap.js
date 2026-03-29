// chap.js - Lay noi dung chuong truyen
// URL dang: https://api.langge.cf/online_reader?book_id=...&source=...&tab=...&item_id=...
function getParam(url, name) {
    var match = url.match(new RegExp("[?&]" + name + "=([^&]+)"));
    return match ? decodeURIComponent(match[1]) : "";
}

function execute(url) {
    url = decodeURIComponent(url);
    var itemId = getParam(url, "item_id");
    var source = getParam(url, "source") || "推荐";
    var tab    = getParam(url, "tab")    || "小说";

    if (!itemId) return Response.error("Khong tim thay item_id chuong");

    // Goi API content bang POST
    var apiUrl = "https://api.langge.cf/content?review=1";
    var bodyData = JSON.stringify({
        item_id: itemId,
        source: source,
        tab: tab,
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
    if (json) {
        if (json.content) {
            content = typeof json.content === "string" ? json.content : "";
        } else if (json.data) {
             if (typeof json.data === "string") content = json.data;
             else if (json.data.content) content = json.data.content;
             else if (json.data.text) content = json.data.text;
        }
    }

    if (!content || content.trim() === "") {
        return Response.error("Noi dung chuong rong. Co the can dang nhap.");
    }

    // Don dep HTML (dua theo plugin_2) de loai ky tu rac va thay <p> thanh <br>
    var htmlContent = Html.parse(content).html();
    var cleanContent = Html.clean(htmlContent, ["p", "br"]);
    content = cleanContent
        .replace(/<\/p>/g, "<br><br>")
        .replace(/<p>/g, "")
        .replace(/(&nbsp;)+/g, " ")
        .replace(/(<br\s*\/?>\s*){2,}/g, "<br><br>")
        .trim();
        
    content = content
        .replace(/[\u200B-\u200F\u202A-\u202E\u2060\uFEFF]/g, "")
        .replace(/<br[^>]*>(?!.*<br)[\s\S]*q\s*q[\s\S]*$/i, "");

    // Xoa toan bo the <img> trong noi dung chuong - khong cho hien thi anh trong chuong
    content = content.replace(/<img[^>]*\/?>/gi, "");

    // Boc trong the <div> de khong bi sat mep tren dien thoai
    content = "<div style='line-height:1.8;font-size:16px;'>" + content + "</div>";

    return Response.success(content);
}
