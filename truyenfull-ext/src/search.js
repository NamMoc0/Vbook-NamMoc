// search.js - Tìm kiếm truyện trên TruyenFull
// Input: key (string từ khóa), page (string số trang)
// Output: [{name, link, cover, description, host}], nextPage
function execute(key, page) {
    if (!page) page = "1";
    var trangHienTai = parseInt(page);
    if (isNaN(trangHienTai) || trangHienTai < 1) trangHienTai = 1;

    // Encode từ khóa tìm kiếm
    var tuKhoa = encodeURIComponent(key);
    var url = 'https://truyenfull.vision/tim-kiem/?tukhoa=' + tuKhoa;
    if (trangHienTai > 1) {
        url = 'https://truyenfull.vision/tim-kiem/trang-' + trangHienTai + '/?tukhoa=' + tuKhoa;
    }

    Console.log('[INFO] search.js - Tìm kiếm: "' + key + '" trang ' + trangHienTai);

    var response = fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    });

    if (!response.ok) {
        Console.log('[ERROR] search.js - HTTP ' + response.status);
        return Response.error('Tìm kiếm thất bại (HTTP ' + response.status + ')');
    }

    var doc = response.html();

    // Phát hiện nếu bị redirect về trang detail (tìm thấy khớp chính xác 1 truyện)
    var h3Title = doc.select('h3.title').first();
    if (h3Title != null) {
        Console.log('[INFO] search.js - Redirect về trang chi tiết, lấy 1 kết quả');
        var tenTruyen = h3Title.text().trim();
        var coverEl = doc.select('div.books img').first();
        var cover = coverEl != null ? coverEl.attr('src') : '';
        if (cover && cover.indexOf('//') === 0) cover = 'https:' + cover;
        return Response.success([{
            name: tenTruyen,
            link: url,
            cover: cover,
            description: 'Kết quả khớp chính xác',
            host: 'https://truyenfull.vision'
        }], null);
    }

    var danhSach = [];
    var cacItem = doc.select('.list-truyen .row');
    Console.log('[INFO] search.js - Kết quả: ' + cacItem.size() + ' truyện');

    for (var i = 0; i < cacItem.size(); i++) {
        var item = cacItem.get(i);
        try {
            var tenEl = item.select('h3.truyen-title a').first();
            if (tenEl == null) continue;
            var ten = tenEl.text().trim();
            var link = tenEl.attr('href');
            if (!link) continue;
            if (link.indexOf('//') === 0) link = 'https:' + link;
            if (link.indexOf('http') !== 0) link = 'https://truyenfull.vision' + link;

            var cover = '';
            var imgEl = item.select('.lazyimg').first();
            if (imgEl != null) {
                cover = imgEl.attr('data-image');
                if (!cover) cover = imgEl.attr('src');
            }
            if (!cover) {
                imgEl = item.select('img').first();
                if (imgEl != null) cover = imgEl.attr('src');
            }
            if (cover && cover.indexOf('//') === 0) cover = 'https:' + cover;

            var moTa = '';
            var tacGiaEl = item.select('span.author').first();
            if (tacGiaEl != null) moTa = 'Tác giả: ' + tacGiaEl.text().trim();

            danhSach.push({
                name: ten,
                link: link,
                cover: cover,
                description: moTa,
                host: 'https://truyenfull.vision'
            });
        } catch (e) {
            Console.log('[WARN] search.js - Lỗi parse item: ' + e);
        }
    }

    // Kiểm tra trang tiếp
    var trangTiep = null;
    if (danhSach.length > 0) {
        var nextEl = doc.select('.pagination a[title*="Trang tiếp"], .pagination a:contains("Trang tiếp")').first();
        if (nextEl != null) {
            var href = nextEl.attr('href');
            if (href && href.indexOf('javascript') < 0) {
                trangTiep = String(trangHienTai + 1);
            }
        }
    }

    Console.log('[INFO] search.js - Trả về ' + danhSach.length + ' kết quả, trang tiếp: ' + trangTiep);
    return Response.success(danhSach, trangTiep);
}
