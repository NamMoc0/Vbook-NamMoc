// detail.js - Chi tiet truyen tren TruyenFull
// Input: url (path hoac full URL trang detail)
var HOST = 'https://truyenfull.vision';

function execute(url) {
    // Dam bao co dau / cuoi
    if (url.charAt(url.length - 1) !== '/') url = url + '/';
    // Neu la path-only thi them host
    if (url.indexOf('http') !== 0) url = HOST + url;

    Console.log('[INFO] detail.js - Dang tai: ' + url);

    var response = fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    });

    if (!response.ok) {
        Console.log('[ERROR] detail.js - HTTP ' + response.status);
        return Response.error('Không thể tải trang chi tiết (HTTP ' + response.status + ')');
    }

    var doc = response.html();

    // Tieu de
    var ten = '';
    var titleEl = doc.select('h3.title').first();
    if (titleEl != null) ten = titleEl.text().trim();
    if (!ten) {
        titleEl = doc.select('h1').first();
        if (titleEl != null) ten = titleEl.text().trim();
    }

    // Anh bia
    var cover = '';
    var coverEl = doc.select('div.books img, div.books .lazyimg').first();
    if (coverEl != null) {
        cover = coverEl.attr('data-image');
        if (!cover) cover = coverEl.attr('src');
    }
    if (cover && cover.indexOf('//') === 0) cover = 'https:' + cover;
    if (cover && cover.indexOf('http') !== 0) cover = HOST + cover;

    // Tac gia
    var tacGia = '';
    var tacGiaEl = doc.select('a[itemprop=\"author\"]').first();
    if (tacGiaEl != null) tacGia = tacGiaEl.text().trim();
    if (!tacGia) {
        tacGiaEl = doc.select('.info a[href*=\"/tac-gia/\"]').first();
        if (tacGiaEl != null) tacGia = tacGiaEl.text().trim();
    }

    // The loai (voi link = path-only)
    var theLoaiEls = doc.select('a[itemprop=\"genre\"]');
    if (theLoaiEls.size() === 0) {
        theLoaiEls = doc.select('.info a[href*=\"/the-loai/\"]');
    }
    var danhSachTheLoai = [];
    for (var i = 0; i < theLoaiEls.size(); i++) {
        var el = theLoaiEls.get(i);
        var tenTL = el.text().trim();
        var linkTL = el.attr('href');
        if (!linkTL || !tenTL) continue;
        // Chuan hoa thanh full URL cho input (vi genre.js can full URL de fetch)
        if (linkTL.indexOf('//') === 0) linkTL = 'https:' + linkTL;
        if (linkTL.indexOf('http') !== 0) linkTL = HOST + linkTL;
        danhSachTheLoai.push({
            title: tenTL,
            input: linkTL,
            script: 'genre.js'
        });
    }

    // Trang thai
    var trangThai = '';
    var trangThaiEl = doc.select('.info span.text-primary').first();
    if (trangThaiEl != null) trangThai = trangThaiEl.text().trim();
    var dangRa = true;
    var lower = trangThai.toLowerCase();
    if (lower.indexOf('hoàn') >= 0 || lower.indexOf('full') >= 0) {
        dangRa = false;
    }

    // Mo ta
    var moTa = '';
    var moTaEl = doc.select('div.desc-text').first();
    if (moTaEl != null) {
        moTaEl.select('a, button').remove();
        moTa = moTaEl.html();
    }
    if (!moTa) {
        moTaEl = doc.select('.story-detail-info, .desc').first();
        if (moTaEl != null) moTa = moTaEl.html();
    }

    // Chi tiet
    var chiTiet = 'Tác giả: ' + (tacGia || 'Không rõ') + '<br>';
    chiTiet += 'Trạng thái: ' + (trangThai || 'Đang ra') + '<br>';
    if (danhSachTheLoai.length > 0) {
        var tenTLs = [];
        for (var j = 0; j < danhSachTheLoai.length; j++) {
            tenTLs.push(danhSachTheLoai[j].title);
        }
        chiTiet += 'Thể loại: ' + tenTLs.join(', ') + '<br>';
    }

    // Goi y (truyen cung tac gia)
    var goiY = [];
    if (tacGia) {
        goiY.push({
            title: 'Truyện của ' + tacGia,
            input: HOST + '/tac-gia/' + encodeURIComponent(tacGia.toLowerCase().replace(/\s+/g, '-')) + '/',
            script: 'genre.js'
        });
    }

    Console.log('[INFO] detail.js - Ten: ' + ten + ', Tac gia: ' + tacGia);

    return Response.success({
        name: ten,
        cover: cover,
        host: HOST,
        author: tacGia,
        description: moTa,
        detail: chiTiet,
        ongoing: dangRa,
        genres: danhSachTheLoai,
        suggests: goiY
    });
}
