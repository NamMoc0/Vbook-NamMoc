// genre.js - Danh sach truyen theo the loai / tab
// Input: url (full URL trang the loai), page (so trang)
// Output: [{name, link, cover, description, host}], nextPage
var HOST = 'https://truyenfull.vision';

function execute(url, page) {
    if (!page) page = "1";
    var trangHienTai = parseInt(page);
    if (isNaN(trangHienTai) || trangHienTai < 1) trangHienTai = 1;

    // Xu ly phan trang: /url/trang-N/
    if (url.charAt(url.length - 1) !== '/') url = url + '/';
    var urlTrang = url;
    if (trangHienTai > 1) {
        urlTrang = url + 'trang-' + trangHienTai + '/';
    }

    Console.log('[INFO] genre.js - Dang tai: ' + urlTrang);

    var response = fetch(urlTrang, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    });

    if (!response.ok) {
        Console.log('[ERROR] genre.js - HTTP ' + response.status);
        return Response.error('Không thể tải danh sách truyện (HTTP ' + response.status + ')');
    }

    var doc = response.html();
    var danhSach = [];

    var cacItem = doc.select('.list-truyen .row');
    Console.log('[INFO] genre.js - Tim thay ' + cacItem.size() + ' truyen');

    for (var i = 0; i < cacItem.size(); i++) {
        var item = cacItem.get(i);
        try {
            // Tieu de & link
            var tenEl = item.select('h3.truyen-title a').first();
            if (tenEl == null) continue;
            var ten = tenEl.text().trim();
            var link = tenEl.attr('href');
            if (!link) continue;

            // Chuan hoa link thanh PATH-ONLY (bo host)
            if (link.indexOf('https://truyenfull.vision') === 0) {
                link = link.substring('https://truyenfull.vision'.length);
            } else if (link.indexOf('//truyenfull.vision') === 0) {
                link = link.substring('//truyenfull.vision'.length);
            }
            // Neu link ko bat dau bang / thi them /
            if (link.charAt(0) !== '/') link = '/' + link;

            // Anh bia - div.lazyimg voi data-image
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

            // Tac gia
            var tacGia = '';
            var tacGiaEl = item.select('span.author').first();
            if (tacGiaEl != null) tacGia = tacGiaEl.text().trim();

            danhSach.push({
                name: ten,
                link: link,
                cover: cover,
                description: tacGia ? 'Tác giả: ' + tacGia : '',
                host: HOST
            });
        } catch (e) {
            Console.log('[WARN] genre.js - Loi parse item: ' + e);
        }
    }

    if (danhSach.length === 0) {
        Console.log('[WARN] genre.js - Khong tim thay truyen nao');
        return Response.error('Không tìm thấy truyện nào trong trang này');
    }

    // Kiem tra trang tiep
    var trangTiep = null;
    var nextEl = doc.select('.pagination a[title*=\"Trang tiếp\"], .pagination a:contains(\"Trang tiếp\")').first();
    if (nextEl != null) {
        var nextHref = nextEl.attr('href');
        if (nextHref && nextHref.indexOf('javascript') < 0) {
            trangTiep = String(trangHienTai + 1);
        }
    }

    Console.log('[INFO] genre.js - Tra ve ' + danhSach.length + ' truyen, trang tiep: ' + trangTiep);
    return Response.success(danhSach, trangTiep);
}
