// genre.js - Script đọc danh sách truyện từ một URL bất kỳ (Hot, Mới, Thể loại)
// Input: url (string), page (string)
// Output: [{name, link, cover, description, host}], nextPage
function execute(url, page) {
    // Đảm bảo page là string số hợp lệ
    if (!page) page = "1";
    var trangHienTai = parseInt(page);
    if (isNaN(trangHienTai) || trangHienTai < 1) trangHienTai = 1;

    // Xây dựng URL phân trang: /url/trang-N/ (trang 1 = URL gốc)
    var urlTrang = url;
    if (url.charAt(url.length - 1) !== '/') url = url + '/';
    if (trangHienTai > 1) {
        urlTrang = url + 'trang-' + trangHienTai + '/';
    } else {
        urlTrang = url;
    }

    Console.log('[INFO] genre.js - Đang tải: ' + urlTrang);

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

    // Lấy từng item truyện trong .list-truyen .row
    var cacItem = doc.select('.list-truyen .row');
    Console.log('[INFO] genre.js - Tìm thấy ' + cacItem.size() + ' truyện');

    cacItem.forEach(function(item) {
        try {
            // Tiêu đề & link
            var tenEl = item.select('h3.truyen-title a').first();
            if (tenEl == null) return;
            var ten = tenEl.text().trim();
            var link = tenEl.attr('href');
            if (!link) return;

            // Chuẩn hóa URL
            if (link.indexOf('//') === 0) link = 'https:' + link;
            if (link.indexOf('http') !== 0) link = 'https://truyenfull.vision' + link;

            // Ảnh bìa - dùng data-image (lazy load) hoặc src
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

            // Mô tả ngắn (nếu có)
            var moTa = '';
            var moTaEl = item.select('.story-item-description, .excerpt, p').first();
            if (moTaEl != null) moTa = moTaEl.text().trim();

            // Tác giả
            var tacGia = '';
            var tacGiaEl = item.select('span.author').first();
            if (tacGiaEl != null) tacGia = tacGiaEl.text().trim();
            if (tacGia) moTa = 'Tác giả: ' + tacGia + (moTa ? '\n' + moTa : '');

            danhSach.push({
                name: ten,
                link: link,
                cover: cover,
                description: moTa,
                host: 'https://truyenfull.vision'
            });
        } catch (e) {
            Console.log('[WARN] genre.js - Lỗi parse item: ' + e);
        }
    });

    if (danhSach.length === 0) {
        Console.log('[WARN] genre.js - Không tìm thấy truyện nào, kiểm tra lại selector');
        return Response.error('Không tìm thấy truyện nào trong trang này');
    }

    // Kiểm tra có trang tiếp không
    var trangTiep = null;
    var nextEl = doc.select('.pagination a[title*="Trang tiếp"], .pagination a:contains("Trang tiếp"), .pagination li:last-child a').first();
    if (nextEl != null) {
        var nextHref = nextEl.attr('href');
        // Nếu nút next tồn tại và không phải trang hiện tại
        if (nextHref && nextHref.indexOf('javascript') < 0) {
            trangTiep = String(trangHienTai + 1);
        }
    }

    Console.log('[INFO] genre.js - Trả về ' + danhSach.length + ' truyện, trang tiếp: ' + trangTiep);
    return Response.success(danhSach, trangTiep);
}
