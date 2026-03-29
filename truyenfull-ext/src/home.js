// home.js - Lựa chọn nguồn sách lớn (Platform)
// Vì vBook không hỗ trợ tab lồng nhau, ta sẽ kết hợp Nguồn + Thể loại
// Từng tab ở đây sẽ trực tiếp gọi gen.js để tải mảng sách
function execute() {
    return Response.success([
        { title: "Cà Chua (Nam Sinh)", input: JSON.stringify({source: "番茄", bdtype: "1", is_special: true}), script: "gen.js" },
        { title: "Cà Chua (Nữ Sinh)", input: JSON.stringify({source: "番茄", bdtype: "2", is_special: true}), script: "gen.js" },
        { title: "Khởi Điểm (Nam)", input: JSON.stringify({source: "起点", bdtype: "1", is_special: true}), script: "gen.js" },
        { title: "Khởi Điểm (Nữ)", input: JSON.stringify({source: "起点", bdtype: "2", is_special: true}), script: "gen.js" },
        { title: "QQ Đọc (Nam)", input: JSON.stringify({source: "QQ阅读", bdtype: "1", is_special: true}), script: "gen.js" },
        { title: "Đỉnh Điểm", input: JSON.stringify({source: "顶点", bdtype: "1", is_special: true}), script: "gen.js" },
        { title: "Bảy Mèo", input: JSON.stringify({source: "七猫", bdtype: "1", is_special: true}), script: "gen.js" }
    ]);
}
