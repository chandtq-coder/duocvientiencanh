# Dược Viên Tiên Cảnh · Trung Thảo Dược (中草藥)

Từ điển tra cứu dược liệu Trung Hoa dạng PWA (HTML/CSS/JS thuần, chạy offline sau lần mở đầu).
Mỗi vị có chữ **phồn thể**, **giản thể**, **pinyin**, **chữ Việt (Hán Việt)**, kèm tên khoa học, tính vị quy kinh,
sinh trưởng, công dụng khoa học, dân gian, cách dùng, liều, độc tính và kết quả đối chiếu Dược điển.

Bản chạy trực tuyến (GitHub Pages): https://chandtq-coder.github.io/duocvientiencanh/

## Chạy thử
```bash
python -m http.server 8770
# mở http://127.0.0.1:8770
```

## Cấu trúc
- `index.html`, `style.css`, `app.js`, `scene.js` — giao diện và cảnh nền
- `data/h1..h21.js` — dữ liệu dược liệu; `data/toxic.js` — độc tính; `data/verify.js` — đối chiếu Dược điển; `data/credits.js` — ghi công ảnh
- `img/` — ảnh WebP đã nén; `sw.js`, `manifest.webmanifest`, `icons/` — PWA

## Lưu ý
- Nội dung chỉ để học tập, **không thay thế** chẩn đoán/điều trị của thầy thuốc. Một số vị có độc hoặc tác dụng mạnh.
- Đối chiếu với Dược điển Trung Quốc 2020 qua bản trích của Shennong Alpha (chưa so sách in); các vị chưa tìm được nguyên văn được ghi rõ trong từng trang.
- Ảnh lấy từ Wikimedia Commons (giấy phép Creative Commons hoặc phạm vi công cộng); tác giả và giấy phép ghi trong `data/credits.js` và trên từng trang vị. Khi dùng lại ảnh, giữ ghi công theo giấy phép của từng ảnh.
