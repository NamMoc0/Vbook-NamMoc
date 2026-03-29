// detail.js - Chi tiết truyện trên TruyenFull
// Input: url (string URL trang detail của truyện)
// Output: {name, cover, host, author, description, detail, ongoing, genres, suggests}
function execute(url) {
    // App tự động bỏ / cuối, ta thêm lại
    if (url.charAt(url.length - 1) !== '/') url = url + '/';

    Console.log('[INFO] detail.js - Đang tải: ' + url);

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

    // ---- Tiêu đề ----
    var ten = '';
    var titleEl = doc.select('h3.title').first();
    if (titleEl != null) ten = titleEl.text().trim();
    if (!ten) {
        titleEl = doc.select('h1').first();
        if (titleEl != null) ten = titleEl.text().trim();
    }

    // ---- Ảnh bìa ----
    var cover = '';
    var coverEl = doc.select('div.books img').first();
    if (coverEl != null) {
        cover = coverEl.attr('src');
        if (!cover) cover = coverEl.attr('data-image');
    }
    if (cover && cover.indexOf('//') === 0) cover = 'https:' + cover;
    if (cover && cover.indexOf('http') !== 0) cover = 'https://truyenfull.vision' + cover;

    // ---- Tác giả ----
    var tacGia = '';
    var tacGiaEl = doc.select('a[itemprop="author"]').first();
    if (tacGiaEl != null) tacGia = tacGiaEl.text().trim();
    if (!tacGia) {
        tacGiaEl = doc.select('.info a[href*="/tac-gia/"]').first();
        if (tacGiaEl != null) tacGia = tacGiaEl.text().trim();
    }

    // ---- Thể loại ----
    var theLoaiEls = doc.select('a[itemprop="genre"]');
    if (theLoaiEls.size() === 0) {
        theLoaiEls = doc.select('.info a[href*="/the-loai/"]');
    }
    var danhSachTheLoai = [];
    theLoaiEls.forEach(function(el) {
        var tenTL = el.text().trim();
        var linkTL = el.attr('href');
        if (!linkTL) return;
        if (linkTL.indexOf('//') === 0) linkTL = 'https:' + linkTL;
        if (linkTL.indexOf('http') !== 0) linkTL = 'https://truyenfull.vision' + linkTL;
        if (tenTL) {
            danhSachTheLoai.push({
                title: tenTL,
                input: linkTL,
                script: 'genre.js'
            });
        }
    });

    // ---- Trạng thái ----
    var trangThai = '';
    var trangThaiEl = doc.select('.info span.text-primary').first();
    if (trangThaiEl != null) trangThai = trangThaiEl.text().trim();

    // Xác định ongoing
    var dangRa = true;
    var lower = trangThai.toLowerCase();
    if (lower.indexOf('hoàn') >= 0 || lower.indexOf('full') >= 0 || lower.indexOf('completed') >= 0) {
        dangRa = false;
    }

    // ---- Mô tả ----
    var moTa = '';
    var moTaEl = doc.select('div.desc-text').first();
    if (moTaEl != null) {
        // Xóa các nút "Hiện thêm" tránh lấy nhầm text
        moTaEl.select('a, button').remove();
        moTa = moTaEl.html();
    }
    if (!moTa) {
        moTaEl = doc.select('.story-detail-info, .desc').first();
        if (moTaEl != null) moTa = moTaEl.html();
    }

    // ---- Thông tin chi tiết ----
    var chiTiet = 'Tác giả: ' + (tacGia || 'Không rõ') + '<br>';
    chiTiet += 'Trạng thái: ' + (trangThai || 'Đang ra') + '<br>';
    if (danhSachTheLoai.length > 0) {
        var tenTLs = [];
        danhSachTheLoai.forEach(function(tl) { tenTLs.push(tl.title); });
        chiTiet += 'Thể loại: ' + tenTLs.join(', ') + '<br>';
    }

    // ---- Truyện cùng tác giả (Suggests) ----
    var goiY = [];
    var cungTacGiaEls = doc.select('.col-truyen-other .other-name a, .list-author a');
    cungTacGiaEls.forEach(function(el) {
        var tenGoiY = el.text().trim();
        var linkGoiY = el.attr('href');
        if (!tenGoiY || !linkGoiY) return;
        if (linkGoiY.indexOf('//') === 0) linkGoiY = 'https:' + linkGoiY;
        if (linkGoiY.indexOf('http') !== 0) linkGoiY = 'https://truyenfull.vision' + linkGoiY;
        if (goiY.length < 5) {
            goiY.push({
                title: tenGoiY,
                input: linkGoiY,
                script: 'detail.js'
            });
        }
    });

    // Nếu không có gợi ý, thử tìm theo tác giả
    if (goiY.length === 0 && tacGia) {
        goiY.push({
            title: 'Truyện của ' + tacGia,
            input: 'https://truyenfull.vision/tac-gia/' + encodeURIComponent(tacGia.toLowerCase().replace(/\s+/g, '-')) + '/',
            script: 'genre.js'
        });
    }

    Console.log('[INFO] detail.js - Tên: ' + ten + ', Tác giả: ' + tacGia + ', Ongoing: ' + dangRa);

    return Response.success({
        name: ten,
        cover: cover,
        host: 'https://truyenfull.vision',
        author: tacGia,
        description: moTa,
        detail: chiTiet,
        ongoing: dangRa,
        genres: danhSachTheLoai,
        suggests: goiY
    });
}
