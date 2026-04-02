// search.js - Tim kiem truyen tren TruyenFull
var HOST = 'https://truyenfull.vision';

function execute(key, page) {
    if (!page) page = "1";
    var trangHienTai = parseInt(page);
    if (isNaN(trangHienTai) || trangHienTai < 1) trangHienTai = 1;

    var tuKhoa = encodeURIComponent(key);
    var url = HOST + '/tim-kiem/?tukhoa=' + tuKhoa;
    if (trangHienTai > 1) {
        url = HOST + '/tim-kiem/trang-' + trangHienTai + '/?tukhoa=' + tuKhoa;
    }

    Console.log('[INFO] search.js - Tim kiem: "' + key + '" trang ' + trangHienTai);

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

    // Phat hien redirect ve trang detail (tim thay khop chinh xac 1 truyen)
    var h3Title = doc.select('h3.title').first();
    if (h3Title != null) {
        Console.log('[INFO] search.js - Redirect ve trang chi tiet');
        var tenTruyen = h3Title.text().trim();
        var coverEl = doc.select('div.books img, div.books .lazyimg').first();
        var cover = '';
        if (coverEl != null) {
            cover = coverEl.attr('data-image');
            if (!cover) cover = coverEl.attr('src');
        }
        if (cover && cover.indexOf('//') === 0) cover = 'https:' + cover;

        // Lay path tu current URL
        var detailLink = url.replace(HOST, '');

        return Response.success([{
            name: tenTruyen,
            link: detailLink,
            cover: cover,
            description: 'Kết quả khớp chính xác',
            host: HOST
        }], null);
    }

    var danhSach = [];
    var cacItem = doc.select('.list-truyen .row');
    Console.log('[INFO] search.js - Ket qua: ' + cacItem.size() + ' truyen');

    for (var i = 0; i < cacItem.size(); i++) {
        var item = cacItem.get(i);
        try {
            var tenEl = item.select('h3.truyen-title a').first();
            if (tenEl == null) continue;
            var ten = tenEl.text().trim();
            var link = tenEl.attr('href');
            if (!link) continue;

            // Chuan hoa link thanh PATH-ONLY
            if (link.indexOf('https://truyenfull.vision') === 0) {
                link = link.substring('https://truyenfull.vision'.length);
            } else if (link.indexOf('//truyenfull.vision') === 0) {
                link = link.substring('//truyenfull.vision'.length);
            }
            if (link.charAt(0) !== '/') link = '/' + link;

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
                host: HOST
            });
        } catch (e) {
            Console.log('[WARN] search.js - Loi parse item: ' + e);
        }
    }

    // Kiem tra trang tiep
    var trangTiep = null;
    if (danhSach.length > 0) {
        var nextEl = doc.select('.pagination a[title*=\"Trang tiếp\"], .pagination a:contains(\"Trang tiếp\")').first();
        if (nextEl != null) {
            var href = nextEl.attr('href');
            if (href && href.indexOf('javascript') < 0) {
                trangTiep = String(trangHienTai + 1);
            }
        }
    }

    Console.log('[INFO] search.js - Tra ve ' + danhSach.length + ' ket qua, trang tiep: ' + trangTiep);
    return Response.success(danhSach, trangTiep);
}
