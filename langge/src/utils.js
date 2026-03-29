// utils.js - Ham tien ich dung chung
// Ham chuyen URL anh qua proxy wp.com de tranh bi chan Referer
function replaceCover(u) {
    if (!u || u === "") return "";
    try {
        // Bo http:// hoac https://
        if (u.indexOf("https://") === 0) u = u.substring(8);
        else if (u.indexOf("http://") === 0) u = u.substring(7);

        var uArr = u.split("/");
        // Thay host bang proxy
        uArr[0] = "https://i0.wp.com/p6-novel.byteimg.com/origin";

        // Xoa cac param ?xxx va ky tu ~xxx khoi tung segment
        var uArr2 = [];
        for (var i = 0; i < uArr.length; i++) {
            var seg = uArr[i];
            if (seg.indexOf("?") >= 0) {
                uArr2.push(seg.split("?")[0]);
            } else if (seg.indexOf("~") >= 0) {
                uArr2.push(seg.split("~")[0]);
            } else {
                uArr2.push(seg);
            }
        }
        return uArr2.join("/");
    } catch (e) {
        return u;
    }
}
