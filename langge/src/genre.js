// genre.js - Hien thi danh sach the loai cua tung binh dai
// Input: "fanqie" hoac "qqread" (tu home.js)
// Output: [{title, input: URL, script: "gen.js"}]
var BASE = "https://api.langge.cf";

function execute(input) {
    var genres = [];

    if (input === "fanqie") {
        // ====== CA CHUA (番茄) ======
        // API: get_discover?source=番茄&tab=小说&type={type}&gender={1|2}&genre_type=0
        var fanqieGenres = [
            // Nam Phu (gender=1)
            { title: "📚 [Nam] Huyền Huyễn",        type: "7",   gender: "1" },
            { title: "📚 [Nam] Tu Tiên",             type: "517", gender: "1" },
            { title: "📚 [Nam] Đô Thị",              type: "1",   gender: "1" },
            { title: "📚 [Nam] Khoa Huyễn Tận Thế",  type: "8",   gender: "1" },
            { title: "📚 [Nam] Lịch Sử",             type: "12",  gender: "1" },
            { title: "📚 [Nam] Huyền Nghi",          type: "10",  gender: "1" },
            { title: "📚 [Nam] Kỳ Huyễn Tiên Hiệp",  type: "259", gender: "1" },
            { title: "📚 [Nam] Game & Thể Thao",     type: "746", gender: "1" },
            { title: "📚 [Nam] Hệ Thống",            type: "19",  gender: "1" },
            { title: "📚 [Nam] Xuyên Không",         type: "37",  gender: "1" },
            { title: "📚 [Nam] Trọng Sinh",          type: "36",  gender: "1" },
            { title: "📚 [Nam] Điền Văn",            type: "23",  gender: "1" },
            // Nu Phu (gender=2)
            { title: "💕 [Nữ] Huyền Huyễn",         type: "7",   gender: "2" },
            { title: "💕 [Nữ] Ngôn Tình Đô Thị",    type: "1",   gender: "2" },
            { title: "💕 [Nữ] Cổ Đại Ngôn Tình",    type: "12",  gender: "2" },
            { title: "💕 [Nữ] Tu Tiên",              type: "517", gender: "2" },
            { title: "💕 [Nữ] Xuyên Không",         type: "37",  gender: "2" },
            { title: "💕 [Nữ] Trọng Sinh",           type: "36",  gender: "2" }
        ];

        for (var i = 0; i < fanqieGenres.length; i++) {
            var g = fanqieGenres[i];
            var url = BASE + "/get_discover?source=" + encodeURIComponent("番茄")
                          + "&tab=" + encodeURIComponent("小说")
                          + "&type=" + g.type
                          + "&gender=" + g.gender
                          + "&genre_type=0";
            genres.push({ title: g.title, input: url, script: "gen.js" });
        }

    } else if (input === "qqread") {
        // ====== QQ DOC (QQ阅读) ======
        // API: discovedata?categoryid={id}&source_type={男频|女频}&source=QQ阅读&tab=小说
        var qqGenres = [
            // Nam Phu
            { title: "📚 [Nam] Huyền Huyễn",     catid: "20001", stype: "男频" },
            { title: "📚 [Nam] Kỳ Huyễn",         catid: "20005", stype: "男频" },
            { title: "📚 [Nam] Võ Hiệp",           catid: "20010", stype: "男频" },
            { title: "📚 [Nam] Tiên Hiệp",         catid: "20014", stype: "男频" },
            { title: "📚 [Nam] Đô Thị",            catid: "20019", stype: "男频" },
            { title: "📚 [Nam] Lịch Sử",           catid: "20028", stype: "男频" },
            { title: "📚 [Nam] Khoa Huyễn",        catid: "20042", stype: "男频" },
            { title: "📚 [Nam] Game",               catid: "20050", stype: "男频" },
            // Nu Phu
            { title: "💕 [Nữ] Huyền Huyễn",       catid: "30001", stype: "女频" },
            { title: "💕 [Nữ] Ngôn Tình",          catid: "30005", stype: "女频" },
            { title: "💕 [Nữ] Cổ Đại Ngôn Tình",  catid: "30010", stype: "女频" },
            { title: "💕 [Nữ] Đô Thị",             catid: "30019", stype: "女频" }
        ];

        for (var j = 0; j < qqGenres.length; j++) {
            var q = qqGenres[j];
            var qurl = BASE + "/discovedata?categoryid=" + q.catid
                            + "&source_type=" + encodeURIComponent(q.stype)
                            + "&source=" + encodeURIComponent("QQ阅读")
                            + "&tab=" + encodeURIComponent("小说");
            genres.push({ title: q.title, input: qurl, script: "gen.js" });
        }

    } else {
        return Response.error("Binh dai khong hop le: " + input);
    }

    return Response.success(genres);
}
