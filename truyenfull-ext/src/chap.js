// chap.js - Tai noi dung chuong tren TruyenFull
// Input: url (path hoac full URL chuong)
var HOST = 'https://truyenfull.vision';

function execute(url) {
    // Neu la path-only thi them host
    if (url.indexOf('http') !== 0) url = HOST + url;

    Console.log('[INFO] chap.js - Bat dau tai chuong: ' + url);

    var response = fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    });

    if (!response.ok) {
        Console.log('[ERROR] chap.js - HTTP ' + response.status);
        return Response.error('Không thể tải nội dung chương (HTTP ' + response.status + ')');
    }

    var doc = response.html();
    var contentEl = doc.select('div.chapter-c').first();

    if (contentEl == null) {
        Console.log('[ERROR] chap.js - Khong tim thay noi dung chuong (class .chapter-c)');
        return Response.error('Lỗi phân tích: Không tìm thấy nội dung');
    }

    // Lam sach HTML: loai bo script, iframe, ads
    contentEl.select('script, iframe, .ads, .ad-zone').remove();

    var noiDung = contentEl.html();

    Console.log('[INFO] chap.js - Da tai xong noi dung (' + noiDung.length + ' ky tu)');
    return Response.success(noiDung);
}
