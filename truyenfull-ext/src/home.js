// home.js - Trang chủ TruyenFull
// Trả về danh sách các tab: Hot, Mới, Hoàn thành, Tiên Hiệp, Ngôn Tình
function execute() {
    return Response.success([
        {
            title: "Truyện Hot",
            input: "https://truyenfull.vision/danh-sach/truyen-hot/",
            script: "genre.js"
        },
        {
            title: "Mới Cập Nhật",
            input: "https://truyenfull.vision/danh-sach/truyen-moi/",
            script: "genre.js"
        },
        {
            title: "Đã Hoàn Thành",
            input: "https://truyenfull.vision/danh-sach/truyen-full/",
            script: "genre.js"
        },
        {
            title: "Tiên Hiệp",
            input: "https://truyenfull.vision/the-loai/tien-hiep/",
            script: "genre.js"
        },
        {
            title: "Kiếm Hiệp",
            input: "https://truyenfull.vision/the-loai/kiem-hiep/",
            script: "genre.js"
        },
        {
            title: "Ngôn Tình",
            input: "https://truyenfull.vision/the-loai/ngon-tinh/",
            script: "genre.js"
        },
        {
            title: "Đam Mỹ",
            input: "https://truyenfull.vision/the-loai/dam-my/",
            script: "genre.js"
        },
        {
            title: "Huyền Huyễn",
            input: "https://truyenfull.vision/the-loai/huyen-huyen/",
            script: "genre.js"
        },
        {
            title: "Xuyên Không",
            input: "https://truyenfull.vision/the-loai/xuyen-khong/",
            script: "genre.js"
        },
        {
            title: "Trọng Sinh",
            input: "https://truyenfull.vision/the-loai/trong-sinh/",
            script: "genre.js"
        }
    ]);
}
