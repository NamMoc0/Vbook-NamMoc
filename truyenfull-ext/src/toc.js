// toc.js - Muc luc (danh sach chuong) tren TruyenFull
// Input: url (path hoac full URL trang detail cua truyen)
var HOST = 'https://truyenfull.vision';

function execute(url) {
    if (url.charAt(url.length - 1) !== '/') url = url + '/';
    // Neu la path-only thi them host
    if (url.indexOf('http') !== 0) url = HOST + url;

    Console.log('[INFO] toc.js - Bat dau tai muc luc: ' + url);

    var tatCaChuong = [];

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

    // Lay tong so trang muc luc
    var soTrang = 1;
    var cuoiEl = doc.select('.pagination a:contains(\"»\")').last();
    if (cuoiEl != null) {
        var hrefCuoi = cuoiEl.attr('href');
        if (hrefCuoi) {
            var match = hrefCuoi.match(/\/trang-(\d+)\//);
            if (match) {
                soTrang = parseInt(match[1]);
            }
        }
    }

    Console.log('[INFO] toc.js - Tong so trang muc luc: ' + soTrang);

    // Ham lay chuong tu mot trang
    function layChuongTuTrang(docTrang) {
        var chuongEls = docTrang.select('ul.list-chapter li a');
        for (var i = 0; i < chuongEls.size(); i++) {
            var el = chuongEls.get(i);
            var tenChuong = el.text().trim();
            var urlChuong = el.attr('href');
            if (!tenChuong || !urlChuong) continue;

            // Chuan hoa thanh PATH-ONLY
            if (urlChuong.indexOf('https://truyenfull.vision') === 0) {
                urlChuong = urlChuong.substring('https://truyenfull.vision'.length);
            } else if (urlChuong.indexOf('//truyenfull.vision') === 0) {
                urlChuong = urlChuong.substring('//truyenfull.vision'.length);
            }
            if (urlChuong.charAt(0) !== '/') urlChuong = '/' + urlChuong;

            tatCaChuong.push({
                name: tenChuong,
                url: urlChuong,
                host: HOST
            });
        }
    }

    // Lay chuong tu trang 1
    layChuongTuTrang(doc);
    Console.log('[INFO] toc.js - Trang 1: ' + tatCaChuong.length + ' chuong');

    // Tai cac trang tiep theo
    for (var i = 2; i <= soTrang; i++) {
        var urlFetch = url + 'trang-' + i + '/';
        Console.log('[INFO] toc.js - Tai trang muc luc ' + i + '/' + soTrang);
        var resp = fetch(urlFetch, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!resp.ok) {
            Console.log('[WARN] toc.js - Bo qua trang ' + i + ' vi HTTP ' + resp.status);
            continue;
        }

        layChuongTuTrang(resp.html());
        Console.log('[INFO] toc.js - Da tai xong trang ' + i + ', tong: ' + tatCaChuong.length + ' chuong');
    }

    if (tatCaChuong.length === 0) {
        Console.log('[ERROR] toc.js - Khong tim thay chuong nao');
        return Response.error('Không tìm thấy chương nào trong mục lục');
    }

    Console.log('[INFO] toc.js - Hoan thanh! Tong cong ' + tatCaChuong.length + ' chuong');
    return Response.success(tatCaChuong);
}
