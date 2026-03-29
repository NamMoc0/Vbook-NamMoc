// chap.js - Noi dung chuong truyen
load("config.js");
load("function.js");

function execute(input) {
    var item_id = getParam(input, "item_id");
    var source = getParam(input, "source");
    var tab = getParam(input, "tab");

    var api = BASE_URL + "/content?review=1";
    var response = fetch(api, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
        body: JSON.stringify({
            "item_id": item_id,
            "source": source,
            "tab": tab,
            "version": "4.11.5.1"
        })
    });

    if (response.ok) {
        var json = response.json();

        if (json.content) {
            var content = json.content;
            var htmlContent = Html.parse(content).html();
            var cleanContent = Html.clean(htmlContent, ["p", "br"]);
            cleanContent = cleanContent
                .replace(/<\/p>/g, "<br><br>")
                .replace(/<p>/g, "")
                .replace(/(&nbsp;)+/g, " ")
                .replace(/(<br\s*\/?>\\s*){2,}/g, "<br><br>")
                .trim();
            cleanContent = cleanContent
                .replace(/[\u200B-\u200F\u202A-\u202E\u2060\uFEFF]/g, "")
                .replace(/<br[^>]*>(?!.*<br)[\s\S]*q\s*q[\s\S]*$/i, "");

            // Xoa toan bo the <img> trong noi dung chuong
            cleanContent = cleanContent.replace(/<img[^>]*\/?>/gi, "");

            if (cleanContent) {
                return Response.success(cleanContent);
            }
        }
    }

    return Response.error("Không thể tải nội dung chương.");
}
