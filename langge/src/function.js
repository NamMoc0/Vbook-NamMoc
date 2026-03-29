function getParam(input, name) {
    var match = input.match(new RegExp("[?&]" + name + "=([^&]+)"));
    return match ? decodeURIComponent(match[1]) : "";
}

function replaceCover(u) {
    if (!u || u === "") return "";
    try {
        if (u.indexOf("https://") === 0) u = u.substring(8);
        else if (u.indexOf("http://") === 0) u = u.substring(7);
        var uArr = u.split("/");
        uArr[0] = "https://i0.wp.com/p6-novel.byteimg.com/origin";
        var uArr2 = [];
        for (var i = 0; i < uArr.length; i++) {
            var x = uArr[i];
            if (x.indexOf("?") < 0 && x.indexOf("~") < 0) uArr2.push(x);
            else uArr2.push(x.split("~")[0]);
        }
        u = uArr2.join("/");
        return u;
    } catch (e) {
        return u;
    }
}
