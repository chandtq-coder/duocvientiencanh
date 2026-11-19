/* Service worker: lưu sẵn toàn bộ khung app + ảnh để dùng offline. Đổi VERSION khi sửa nội dung. */
const VERSION = "ttd-v13";
const SHELL = [
  "./", "index.html", "style.css", "app.js", "scene.js", "manifest.webmanifest",
  "data/h1.js", "data/h2.js", "data/h3.js", "data/h4.js", "data/h5.js", "data/h6.js", "data/h7.js", "data/h8.js", "data/h9.js", "data/h10.js", "data/h11.js", "data/h12.js", "data/h13.js", "data/h14.js", "data/h15.js", "data/h16.js", "data/h17.js", "data/credits.js", "data/toxic.js", "data/verify.js",
  "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png"
];
const IMAGES = ["img/ba-kich.webp", "img/ba-tu-nhan.webp", "img/bac-ha.webp", "img/bach-bo.webp", "img/bach-cap.webp", "img/bach-chi.webp", "img/bach-dau-ong.webp", "img/bach-hoa-xa-thiet-thao.webp", "img/bach-hop.webp", "img/bach-mao-can.webp", "img/bach-qua.webp", "img/bach-thuoc.webp", "img/bach-tien-bi.webp", "img/bach-truat.webp", "img/ban-ha.webp", "img/ban-lam-can.webp", "img/bo-cong-anh.webp", "img/bo-cot-chi.webp", "img/cam-thao.webp", "img/can-khuong.webp", "img/cao-luong-khuong.webp", "img/cat-can.webp", "img/cat-canh.webp", "img/cau-dang.webp", "img/cau-ky-tu.webp", "img/cau-tich.webp", "img/chi-thuc.webp", "img/chi-tu.webp", "img/chiet-boi-mau.webp", "img/cot-toai-bo.webp", "img/cuc-hoa.webp", "img/dai-hoang.webp", "img/dai-ke.webp", "img/dai-tao.webp", "img/dam-duong-hoac.webp", "img/dam-truc-diep.webp", "img/dan-sam.webp", "img/dang-sam.webp", "img/dao-nhan.webp", "img/dia-cot-bi.webp", "img/dia-du.webp", "img/dia-hoang.webp", "img/dia-phu-tu.webp", "img/dien-ho-sach.webp", "img/dinh-huong.webp", "img/do-trong.webp", "img/doc-hoat.webp", "img/dong-trung-ha-thao.webp", "img/duong-quy.webp", "img/ha-kho-thao.webp", "img/ha-thu-o.webp", "img/ha-tu.webp", "img/hanh-nhan.webp", "img/hau-phac.webp", "img/hoa-ma-nhan.webp", "img/hoa-tieu.webp", "img/hoac-huong.webp", "img/hoai-son.webp", "img/hoang-ba.webp", "img/hoang-cam.webp", "img/hoang-ky.webp", "img/hoang-lien.webp", "img/hoang-tinh.webp", "img/hoe-hoa.webp", "img/hong-hoa.webp", "img/hop-hoan-bi.webp", "img/huong-phu.webp", "img/huyen-sam.webp", "img/ich-mau.webp", "img/ich-tri-nhan.webp", "img/ke-huyet-dang.webp", "img/khiem-thuc.webp", "img/kho-sam.webp", "img/khoan-dong-hoa.webp", "img/khuong-hoang.webp", "img/kim-anh-tu.webp", "img/kim-ngan-hoa.webp", "img/kim-tien-thao.webp", "img/kinh-gioi.webp", "img/la-bac-tu.webp", "img/la-han-qua.webp", "img/lien-kieu.webp", "img/lien-tu.webp", "img/linh-chi.webp", "img/lo-can.webp", "img/long-dom.webp", "img/long-nhan.webp", "img/ma-hoang.webp", "img/ma-tien-thao.webp", "img/ma-tien-tu.webp", "img/ma-xi-hien.webp", "img/mach-mon-dong.webp", "img/man-kinh-tu.webp", "img/mau-don-bi.webp", "img/moc-huong.webp", "img/moc-qua.webp", "img/nga-truat.webp", "img/ngai-diep.webp", "img/ngo-thu-du.webp", "img/ngoc-truc.webp", "img/ngu-gia-bi.webp", "img/ngu-tinh-thao.webp", "img/ngu-vi-tu.webp", "img/nguu-bang-tu.webp", "img/nguu-tat.webp", "img/nhan-sam.webp", "img/nhan-tran.webp", "img/nhuc-dau-khau.webp", "img/nhuc-que.webp", "img/nhuc-thung-dung.webp", "img/nu-trinh-tu.webp", "img/o-duoc.webp", "img/o-mai.webp", "img/phan-ta-diep.webp", "img/phat-thu.webp", "img/phong-ky.webp", "img/phong-phong.webp", "img/phu-tu.webp", "img/phuc-linh.webp", "img/quyet-minh-tu.webp", "img/sa-nhan.webp", "img/sai-ho.webp", "img/sinh-khuong.webp", "img/son-dau-can.webp", "img/son-thu-du.webp", "img/son-tra.webp", "img/tam-that.webp", "img/tan-bi.webp", "img/tan-di.webp", "img/tan-giao.webp", "img/tan-lang.webp", "img/tang-bach-bi.webp", "img/tang-diep.webp", "img/tang-ky-sinh.webp", "img/tay-duong-sam.webp", "img/thach-hoc.webp", "img/thach-xuong-bo.webp", "img/thang-ma.webp", "img/thanh-hao.webp", "img/thien-hoa-phan.webp", "img/thien-ma.webp", "img/thien-mon-dong.webp", "img/thien-nam-tinh.webp", "img/tho-phuc-linh.webp", "img/tho-ty-tu.webp", "img/thuong-nhi-tu.webp", "img/thuong-truat.webp", "img/tien-ho.webp", "img/tieu-hoi-huong.webp", "img/toan-tao-nhan.webp", "img/trac-ba-diep.webp", "img/trach-lan.webp", "img/trach-ta.webp", "img/tran-bi.webp", "img/tri-mau.webp", "img/tru-linh.webp", "img/trung-lau.webp", "img/tu-to-diep.webp", "img/tu-uyen.webp", "img/tuc-doan.webp", "img/ty-ba-diep.webp", "img/uat-kim.webp", "img/vien-chi.webp", "img/vuong-bat-luu-hanh.webp", "img/xa-can.webp", "img/xa-tien-tu.webp", "img/xich-thuoc.webp", "img/xich-tieu-dau.webp", "img/xuyen-boi-mau.webp", "img/xuyen-khung.webp", "img/xuyen-luyen-tu.webp", "img/xuyen-o.webp", "img/xuyen-tam-lien.webp", "img/y-di.webp"];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(SHELL);
    // ảnh: cố gắng lưu hết nhưng một ảnh lỗi không làm hỏng việc cài
    await Promise.all(IMAGES.map((u) => c.add(u).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const c = await caches.open(VERSION);
    const hit = await c.match(req, { ignoreSearch: true });
    const net = fetch(req).then((r) => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }          // trả bản cache, cập nhật ngầm
    const r = await net;
    if (r) return r;
    if (req.mode === "navigate") return c.match("index.html");
    return new Response("", { status: 504 });
  })());
});
