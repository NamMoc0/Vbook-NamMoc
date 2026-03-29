// chap.js - Tải nội dung chương trên TruyenFull
// Input: url (string URL chương)
// Output: HTML nội dung chương
function execute(url) {
    Console.log('[INFO] chap.js - Bắt đầu tải chương: ' + url);

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
        Console.log('[ERROR] chap.js - Không tìm thấy nội dung chương (class .chapter-c)');
        return Response.error('Lỗi phân tích: Không tìm thấy nội dung');
    }

    // Làm sạch HTML: loại bỏ script, iframe
    contentEl.select('script, iframe').remove();

    var noiDung = contentEl.html();
    
    // Ở TruyenFull đôi khi có các text rác do quảng cáo, hoặc credit của website
    // Có thể thêm filter replace ở đây nếu cần, hiện tại lấy raw HTML trong div.chapter-c là khá ổn.
    
    // Một số truyện có cấu trúc text bị dính, thêm format nếu cần:
    // noiDung = noiDung.replace(/<br\s*\/?>/gi, '<br><br>'); 

    Console.log('[INFO] chap.js - Đã tải xong nội dung (' + noiDung.length + ' ký tự)');
    return Response.success(noiDung);
}
