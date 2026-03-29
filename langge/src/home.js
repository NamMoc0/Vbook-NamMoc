// home.js - Chon binh dai (Platform) -> genre.js hien thi the loai
load("config.js");

function execute() {
    return Response.success([
        { title: "🍅 Cà Chua (番茄)", input: "fanqie", script: "genre.js" },
        { title: "📱 QQ Đọc (QQ阅读)", input: "qqread", script: "genre.js" }
    ]);
}
