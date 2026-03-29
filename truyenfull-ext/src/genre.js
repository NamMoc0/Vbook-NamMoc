// genre.js - Chức năng lọc thể loại tổng hợp của App vBook (Menu Lọc Thể Loại)
// Cung cấp danh sách các nguồn và tiểu thể loại phổ biến nhất
// Trỏ chung về gen.js
function execute() {
    var items = [];
    var cats = [
        { id: "1", title: "Phổ Biến Nhất", gender: "1" },
        { id: "2", title: "Nữ Sinh", gender: "0" },
        { id: "3", title: "Hoàn Thành", gender: "1" },
        { id: "4", title: "Mới Cập Nhật", gender: "1" }
    ];
    
    var sources = ["番茄", "起点", "QQ阅读", "顶点", "七猫", "塔读", "猫眼"];
    var sourceNames = ["Cà Chua", "Khởi Điểm", "QQ", "Đỉnh Điểm", "Bảy Mèo", "Tháp Độc", "Mao Nhãn"];

    for (var i = 0; i < sources.length; i++) {
        var s = sources[i];
        var sName = sourceNames[i];
        
        for (var j = 0; j < cats.length; j++) {
            var c = cats[j];
            items.push({
                title: "[" + sName + "] " + c.title,
                input: JSON.stringify({
                    bdtype: c.id,
                    gender: c.gender,
                    source: s,
                    is_special: true
                }),
                script: "gen.js"
            });
        }
    }

    return Response.success(items);
}
