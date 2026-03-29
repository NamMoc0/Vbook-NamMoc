// toc.js - Mục lục (danh sách chương) trên TruyenFull
// Input: url (string URL trang detail của truyện)
// Output: [{name, url, host}]
// NOTE: TruyenFull phân trang mục lục theo dạng /truyen-slug/trang-N/#list-chapter
// Mỗi trang có 50 chương. Script này tải toàn bộ tất cả các trang mục lục.
function execute(url) {
    // App tự động bỏ / cuối
    if (url.charAt(url.length - 1) !== '/') url = url + '/';

    Console.log('[INFO] toc.js - Bắt đầu tải mục lục: ' + url);

    var tatCaChuong = [];

    // Tải trang đầu tiên để lấy tổng số trang mục lục
    var response = fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    });

    if (!response.ok) {
        Console.log('[ERROR] toc.js - HTTP ' + response.status);
        return Response.error('Không thể tải mục lục (HTTP ' + response.status + ')');
    }

    var doc = response.html();

    // Lấy tổng số trang mục lục từ nút "Cuối" trong pagination
    var soTrang = 1;
    var cuoiEl = doc.select('.pagination a[title*="Cuối"], .pagination a:contains(\"»\")').last();
    if (cuoiEl != null) {
        var hrefCuoi = cuoiEl.attr('href');
        if (hrefCuoi) {
            // Pattern: /truyen-slug/trang-33/#list-chapter
            var match = hrefCuoi.match(/\/trang-(\d+)\//);
            if (match) {
                soTrang = parseInt(match[1]);
            }
        }
    }

    Console.log('[INFO] toc.js - Tổng số trang mục lục: ' + soTrang);

    // Hàm lấy danh sách chương từ một trang
    function layChuongTuTrang(docTrang) {
        var chuongEls = docTrang.select('ul.list-chapter li a');
        chuongEls.forEach(function(el) {
            var tenChuong = el.text().trim();
            var urlChuong = el.attr('href');
            if (!tenChuong || !urlChuong) return;
            if (urlChuong.indexOf('//') === 0) urlChuong = 'https:' + urlChuong;
            if (urlChuong.indexOf('http') !== 0) urlChuong = 'https://truyenfull.vision' + urlChuong;
            tatCaChuong.push({
                name: tenChuong,
                url: urlChuong,
                host: 'https://truyenfull.vision'
            });
        });
    }

    // Lấy chương từ trang 1 (đã tải rồi)
    layChuongTuTrang(doc);
    Console.log('[INFO] toc.js - Trang 1: ' + tatCaChuong.length + ' chương');

    // Tải các trang tiếp theo nếu có
    for (var i = 2; i <= soTrang; i++) {
        var urlTrang = url + 'trang-' + i + '/#list-chapter';
        // Tránh lấy phần fragment trong URL thực tế
        var urlFetch = url + 'trang-' + i + '/';

        Console.log('[INFO] toc.js - Tải trang mục lục ' + i + '/' + soTrang);
        var resp = fetch(urlFetch, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!resp.ok) {
            Console.log('[WARN] toc.js - Bỏ qua trang ' + i + ' vì HTTP ' + resp.status);
            continue;
        }

        layChuongTuTrang(resp.html());
        Console.log('[INFO] toc.js - Đã tải xong trang ' + i + ', tổng: ' + tatCaChuong.length + ' chương');
    }

    if (tatCaChuong.length === 0) {
        Console.log('[ERROR] toc.js - Không tìm thấy chương nào');
        return Response.error('Không tìm thấy chương nào trong mục lục');
    }

    Console.log('[INFO] toc.js - Hoàn thành! Tổng cộng ' + tatCaChuong.length + ' chương');
    return Response.success(tatCaChuong);
}
