var BASE=(function(){try{return new URL('./',document.currentScript.src).pathname;}catch(e){return location.pathname.replace(/[^\/]*$/,'');}})();
(function(){
"use strict";
var H = window.HERBS || [], CR = window.CREDITS || {};
var app = document.getElementById("app");

var GROUPS = [
  ["bo","Bổ hư 補虛"],["giaibieu","Giải biểu 解表"],["thanhnhiet","Thanh nhiệt 清熱"],
  ["taha","Tả hạ 瀉下"],["loithuy","Lợi thủy · Hóa thấp 利水化濕"],["only","Ôn lý 溫裡"],
  ["hoathuyet","Hoạt huyết 活血"],["hoadam","Hóa đàm · Bình can 化痰平肝"],
  ["khuphong","Khu phong thấp 祛風濕"],["thusap","Thu sáp 收澀"],["lykhi","Lý khí · Tiêu thực 理氣消食"],["khutrung","Khu trùng 驅蟲"],["congdoc","Công độc · Thổ 攻毒涌吐"]
];
var GICON={bo:"🌱",giaibieu:"🍃",thanhnhiet:"❄️",taha:"🌊",loithuy:"💧",only:"🔥",hoathuyet:"🌸",hoadam:"🍵",thusap:"🍇",khuphong:"🦴",lykhi:"🍊",khutrung:"🐛",congdoc:"☠️"};
var GNAME = {}; GROUPS.forEach(function(g){GNAME[g[0]]=g[1];});
var TOX = window.TOX || {}, UNV = window.UNVERIFIED || {}, FIX = window.FIXED || {};
/* Nguồn tham khảo cho vị chưa đối chiếu được Dược điển: ưu tiên nguồn cụ thể đã tìm thấy (REFS), nếu thiếu thì ghi giáo trình + y văn */
function refSrc(h){
  var R=(window.REFS||{})[h.id],r=[];
  if(R&&R.length){
    R.forEach(function(x){r.push(x[0]+(x[1]==="m"?" (một nguồn)":""));});
    return esc(r.join("; "));
  }
  var s=h.src||"";
  if(s.indexOf("神農本草經")>=0)r.push("《神農本草經》");
  r.push("giáo trình 《中药学》 (Trung dược học)");
  r.push("y văn Trung thảo dược 中草藥");
  return esc(r.join("; "));
}
var TOXICON = {doc:"☠",manh:"⚠",luu:"ⓘ"};
var TOXLBL = {doc:"CÓ ĐỘC",manh:"TÁC DỤNG MẠNH",luu:"LƯU Ý AN TOÀN"};
function toxBadge(id){var t=TOX[id];return t?'<span class="tb tb-'+t.lv+'">'+TOXICON[t.lv]+' '+esc(t.lab)+'</span>':"";}

var io=("IntersectionObserver" in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{rootMargin:"0px 0px -6% 0px",threshold:.05}):null;
function reveal(root){var els=(root||document).querySelectorAll(".card:not(.in),section.s:not(.in)"),i=0;els.forEach(function(el){if(io){el.style.transitionDelay=Math.min((i++%12)*45,500)+"ms";io.observe(el);}else el.classList.add("in");});}
function enter(){app.classList.remove("enter");void app.offsetWidth;app.classList.add("enter");}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function norm(s){return String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/đ/g,"d").replace(/Đ/g,"d").toLowerCase();}
function tinhClass(s){
  var m=[["hot",/rất nóng|đại nhiệt/i],["warm",/ấm/i],["cold",/lạnh|mát/i],["neutral",/bình/i]],best="neutral",pos=1e9;
  m.forEach(function(p){var r=p[1].exec(s||"");if(r&&r.index<pos){pos=r.index;best=p[0];}});
  return best;
}
var byId={}; H.forEach(function(h){byId[h.id]=h; h._q=norm([h.t,h.s,h.py,h.vi,h.al,h.la,h.cat,h.tinh,h.vj,h.qk,h.part,h.fam,h.sci,h.folk,h.use].join(" ")); h._n=norm([h.t,h.s,h.py,h.vi,h.al,h.la].join(" "));});
H.sort(function(a,b){return a.vi.localeCompare(b.vi,"vi");});

/* yêu thích */
var favs={};
try{favs=JSON.parse(localStorage.getItem("ttd-favs")||"{}")||{};}catch(e){favs={};}
function saveFavs(){try{localStorage.setItem("ttd-favs",JSON.stringify(favs));}catch(e){}}

/* trạng thái danh sách */
var st={q:"",g:"all",fav:false,tox:false,sort:"vi"};
try{var s0=JSON.parse(sessionStorage.getItem("ttd-st")||"null");if(s0)st=s0;}catch(e){}
function saveSt(){try{sessionStorage.setItem("ttd-st",JSON.stringify(st));}catch(e){}}

function img(h,cls){
  return '<img src="img/'+h.id+'.webp" alt="'+esc(h.vi+" – "+h.t+" – "+h.la)+'" loading="lazy" decoding="async" '+(cls||"")+' onerror="this.replaceWith(Object.assign(document.createElement(\'div\'),{className:\'han\',style:\'display:grid;place-items:center;height:100%;font-size:64px;color:#a79e8a\',textContent:\''+h.t.charAt(0)+'\'}))">';
}

function filtered(){
  var q=norm(st.q.trim()),words=q?q.split(/\s+/):[];
  var out=H.filter(function(h){
    if(st.g!=="all"&&h.g!==st.g)return false;
    if(st.fav&&!favs[h.id])return false;
    if(st.tox&&!TOX[h.id])return false;
    return words.every(function(w){return h._q.indexOf(w)>=0;});
  });
  if(words.length){ // ưu tiên khớp tên
    out.sort(function(a,b){var an=words.every(function(w){return a._n.indexOf(w)>=0;}),bn=words.every(function(w){return b._n.indexOf(w)>=0;});return (bn-an)||a.vi.localeCompare(b.vi,"vi");});
  } else if(st.sort==="py"){
    out.sort(function(a,b){return norm(a.py).localeCompare(norm(b.py));});
  } else if(st.sort==="han"){
    out.sort(function(a,b){return a.t.localeCompare(b.t,"zh");});
  }
  return out;
}

function cardHTML(h){
  return '<li class="card"><a href="'+BASE+h.id+'"><div class="ph">'+img(h)+'<span class="gi" title="'+esc(GNAME[h.g]||"")+'">'+(GICON[h.g]||"🌿")+'</span><span class="zhov han">'+esc(h.t)+'</span></div><div class="tx">'+
   '<div class="py">'+esc(h.py)+'</div><div class="vi">'+esc(h.vi)+'</div>'+(h.s!==h.t?'<div class="alt han">'+esc(h.s)+'</div>':'')+toxBadge(h.id)+'</div></a>'+
   '<button class="fav" data-fav="'+h.id+'" aria-pressed="'+(!!favs[h.id])+'" aria-label="Yêu thích '+esc(h.vi)+'">'+(favs[h.id]?"♥":"♡")+'</button></li>';
}

function renderList(){
  var nTox=H.filter(function(h){return TOX[h.id];}).length;
  var chips='<button class="chip" aria-pressed="'+(st.g==="all"&&!st.fav&&!st.tox)+'" data-g="all">Tất cả ('+H.length+')</button>'+
   '<button class="chip chip-tox" aria-pressed="'+st.tox+'" data-toxf="1">☠ Có độc / thận trọng · '+nTox+'</button>'+
   GROUPS.map(function(g){var n=H.filter(function(h){return h.g===g[0];}).length;return '<button class="chip" aria-pressed="'+(st.g===g[0])+'" data-g="'+g[0]+'">'+(GICON[g[0]]||"")+' '+esc(g[1])+' · '+n+'</button>';}).join("")+
   '<button class="chip" aria-pressed="'+st.fav+'" data-favf="1">♥ Đã lưu</button>';
  var d=new Date(),td=H[(Math.floor((d-new Date(d.getFullYear(),0,0))/864e5))%H.length];
  app.innerHTML=
   '<div class="heroTop"><span class="lantern l1"></span><span class="lantern l2"></span><h1 class="big">藥園仙境</h1><p class="sub">Dược Viên Tiên Cảnh</p>'+
   '<p class="lead">Dược Viên gồm: '+H.length+' vị dược liệu được chia thành '+GROUPS.length+' khu: '+GROUPS.map(function(g){var n=H.filter(function(h){return h.g===g[0];}).length;return (GICON[g[0]]||"")+" "+g[1].replace(/\s*[一-鿿]+$/,"")+" ("+n+")";}).join(" · ")+'.</p></div>'+
   '<a class="today" href="'+BASE+td.id+'"><div class="ph">'+img(td)+'</div><div class="tx"><div class="eyebrow">✦ Vị thuốc hôm nay</div><div class="zh han">'+esc(td.t)+'</div><div class="py" style="color:var(--lotus)">'+esc(td.py)+'</div><div class="vi">'+esc(td.vi)+'</div><p>'+esc(td.cat)+' · '+esc(td.tinh.split(".")[0].split(";")[0])+'</p></div></a>'+
   '<div class="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'+
   '<input id="q" type="search" inputmode="search" autocomplete="off" placeholder="Tìm: 人參, 人参, rénshēn, nhân sâm, bổ khí…" value="'+esc(st.q)+'" aria-label="Tìm dược liệu">'+
   (st.q?'<button id="clr" aria-label="Xóa">×</button>':'')+'</div>'+
   '<p class="hint">Gõ chữ Hán (phồn/giản), pinyin (có hoặc không dấu thanh), tên Việt, tên khoa học hoặc công dụng.</p>'+
   '<div class="chips" role="group" aria-label="Nhóm dược">'+chips+'</div>'+
   '<div class="bar"><span id="cnt"></span><label>Sắp xếp <select id="sort"><option value="vi">A→Z (Việt)</option><option value="py">Pinyin</option><option value="han">Chữ Hán</option></select></label></div>'+
   '<ul class="grid" id="grid"></ul>';
  document.getElementById("sort").value=st.sort;
  refreshGrid();enter();
}
function refreshGrid(){
  var r=filtered();
  document.getElementById("cnt").textContent=r.length+" vị";
  document.getElementById("grid").innerHTML=r.length?r.map(cardHTML).join(""):'<li class="empty" style="grid-column:1/-1">Không có vị nào khớp. Thử bỏ dấu hoặc gõ ngắn hơn.</li>';
  reveal(document.getElementById("grid"));
}

function sec(ic,title,txt,cls,key){return txt?'<section class="s '+(cls||"")+'"><h2><span aria-hidden="true">'+ic+'</span>'+title+'</h2><p>'+esc(txt)+'</p>'+(key?'<div class="ext" data-ext="'+key+'"></div>':"")+'</section>':"";}
/* Phần mở rộng chi tiết: tải theo từng vị khi mở trang (data/ext/<id>.json) và gắn vào đúng mục */
function loadExt(id){
  fetch(BASE+"data/ext/"+id+".json").then(function(r){return r.ok?r.json():null;}).then(function(x){
    if(!x||pathKey()!==id)return;
    ["grow","sci","folk","use","avoid"].forEach(function(k){
      var box=app.querySelector('.ext[data-ext="'+k+'"]');if(!box||!x[k])return;
      box.innerHTML=x[k].map(function(p){return '<h3>'+esc(p[0])+'</h3><p>'+esc(p[1])+'</p>';}).join("");
    });
  }).catch(function(){});
}

function renderDetail(id){
  var h=byId[id]; if(!h){history.replaceState(null,"",BASE);renderList();return;}
  var i=H.indexOf(h),p=H[(i+H.length-1)%H.length],n=H[(i+1)%H.length],c=CR[id];
  document.title=h.vi+" "+h.t+" · Trung Thảo Dược";
  var cap=c?'Ảnh: '+esc(c.artist||"Wikimedia Commons")+' · '+esc(c.lic)+' · <a href="'+esc(c.page)+'" target="_blank" rel="noopener">nguồn</a>'+(c.note?'<br><b>'+esc(c.note)+'</b>':''):'';
  var tc=tinhClass(h.tinh);
  app.innerHTML=
   '<a class="back" href="'+BASE+'">← Danh sách</a>'+
   '<div class="hero"><span class="water han" aria-hidden="true">'+esc(h.t.charAt(0))+'</span><figure><div class="frame">'+img(h)+'</div><figcaption>'+cap+'</figcaption></figure>'+
   '<div class="names"><h1>'+esc(h.vi)+'</h1><p class="al">'+esc(h.al)+'</p>'+
   '<dl class="four"><div><dt>Phồn thể 繁體</dt><dd class="han">'+esc(h.t)+'</dd></div>'+
   '<div><dt>Giản thể 简体</dt><dd class="han">'+esc(h.s)+'</dd></div>'+
   '<div class="py"><dt>Pinyin 拼音</dt><dd>'+esc(h.py)+'</dd></div>'+
   '<div class="vn"><dt>Chữ Việt (Hán Việt)</dt><dd>'+esc(h.vi)+'</dd></div></dl>'+
   '<div class="tags"><span class="tag '+tc+'">'+esc(h.tinh.split(".")[0].split(";")[0])+'</span><span class="tag plain">Vị: '+esc(h.vj)+'</span><span class="tag plain">'+esc(GNAME[h.g]||"")+'</span>'+
   '<button class="chip" data-fav="'+h.id+'" aria-pressed="'+(!!favs[h.id])+'">'+(favs[h.id]?"♥ Đã lưu":"♡ Lưu")+'</button></div>'+
   (TOX[h.id]?'<div class="toxic toxic-'+TOX[h.id].lv+'" role="note"><b>'+TOXICON[TOX[h.id].lv]+' '+(TOX[h.id].lab.indexOf(TOXLBL[TOX[h.id].lv])===0?'':TOXLBL[TOX[h.id].lv]+' — ')+esc(TOX[h.id].lab)+'</b><br>'+esc(TOX[h.id].txt)+'</div>':'<div class="toxic toxic-ok">Không có cảnh báo độc tính riêng ở liều thông thường, nhưng vẫn cần tuân liều và hỏi thầy thuốc khi có bệnh nền, có thai, hay đang dùng thuốc.</div>')+
   '</div></div>'+
   '<dl class="meta">'+
   '<div><dt>Tên khoa học</dt><dd><i>'+esc(h.la)+'</i></dd></div>'+
   '<div><dt>Họ thực vật</dt><dd>'+esc(h.fam)+'</dd></div>'+
   '<div><dt>Tên gọi khác</dt><dd>'+esc(h.al)+'</dd></div>'+
   '<div><dt>Bộ phận dùng</dt><dd>'+esc(h.part)+'</dd></div>'+
   '<div><dt>Phân loại</dt><dd>'+esc(h.cat)+'</dd></div>'+
   '<div><dt>Tính (性)</dt><dd>'+esc(h.tinh)+'</dd></div>'+
   '<div><dt>Vị (味)</dt><dd>'+esc(h.vj)+'</dd></div>'+
   '<div><dt>Quy kinh (歸經)</dt><dd>'+esc(h.qk)+'</dd></div>'+
   '<div><dt>Nguồn cổ</dt><dd>'+esc(h.src)+'</dd></div>'+
   '<div><dt>Đối chiếu Dược điển</dt><dd>'+(UNV[h.id]?'<span class="vf vf-no">⚠ Chưa đối chiếu được</span> '+esc(UNV[h.id])+'<br><small>Nguồn tham khảo: '+refSrc(h)+'.</small>':'<span class="vf vf-ok">✔ Đã đối chiếu Dược điển TQ 2020</span> (tính, vị, quy kinh, liều, loài gốc)'+(FIX[h.id]?'<br><small>Đã chỉnh theo đối chiếu: '+esc(FIX[h.id])+'.</small>':''))+'</dd></div></dl>'+
   (h.kinh?'<div class="kinh"><div class="lbl">Trích cổ thư · 《神農本草經》</div><p class="z">'+esc(h.kinh)+'</p><p class="v">'+esc(h.kv)+'</p><p class="note">Trích theo bản lưu hành phổ biến; các bản chép có dị bản chữ. Bản dịch tiếng Việt chỉ mang tính tham khảo.</p></div>':'')+
   sec("生","Sinh trưởng &amp; thu hái".replace("&amp;","&"),h.grow,"","grow")+
   sec("科","Công dụng theo khoa học hiện đại",h.sci,"","sci")+
   sec("民","Công dụng dân gian &amp; y học cổ truyền".replace("&amp;","&"),h.folk,"","folk")+
   sec("用","Cách dùng",h.use+(h.dose?" Liều tham khảo: "+h.dose+".":""),"","use")+
   sec("慎","Kiêng kỵ &amp; thận trọng".replace("&amp;","&"),h.avoid,"warn","avoid")+
   '<div class="pager"><a href="'+BASE+p.id+'"><small>← Trước</small>'+esc(p.vi)+' '+esc(p.t)+'</a><a href="'+BASE+n.id+'"><small>Sau →</small>'+esc(n.vi)+' '+esc(n.t)+'</a></div>';
  window.scrollTo({top:0,behavior:"instant"});enter();reveal(app);if(window.TTD_chime)TTD_chime();loadExt(h.id);
}

function renderAbout(){
  document.title="Giới thiệu · Trung Thảo Dược";
  var rows=H.filter(function(h){return CR[h.id];}).map(function(h){var c=CR[h.id];return '<li>'+esc(h.vi)+' — '+esc(c.artist||"")+', '+esc(c.lic)+' (<a href="'+esc(c.page)+'" target="_blank" rel="noopener">Commons</a>)</li>';}).join("");
  app.innerHTML='<div class="prose"><h1>Giới thiệu</h1>'+
  '<p><b>Trung Thảo Dược</b> là từ điển tra cứu '+H.length+' vị dược liệu Trung Hoa (中草藥), mỗi vị có đủ bốn kiểu chữ: <b>phồn thể</b>, <b>giản thể</b>, <b>pinyin</b> và <b>chữ Việt (Hán Việt)</b>. Ứng dụng chạy offline sau lần mở đầu tiên và có thể cài như app (PWA).</p>'+
  '<h2>Nguồn tham khảo</h2><ul>'+
  '<li>《神農本草經》(Thần Nông Bản Thảo Kinh, khoảng thế kỷ 1–2) — chia thuốc làm Thượng, Trung, Hạ phẩm; các câu trích trong ứng dụng.</li>'+
  '<li>《名醫別錄》, 《新修本草》(659), 《開寶本草》(973), 《本草綱目》(1578), 《本草從新》(1757) — các bản thảo kế tiếp.</li>'+
  '<li>《中藥學》 (giáo trình Trung dược học) — cách phân nhóm công năng (giải biểu, thanh nhiệt, bổ hư…).</li>'+
  '<li>《中華人民共和國藥典》 (Dược điển Trung Quốc) — liều dùng tham khảo, bộ phận dùng, tính vị quy kinh.</li>'+
  '<li>《中華藥典》 (Dược điển Đài Loan) và 藥園導覽手冊 (cẩm nang vườn thuốc, Khoa Dược học Trung Quốc &amp; Tài nguyên Trung y, Đại học Y Trung Quốc Đài Loan — <a href="https://cmuscmr.cmu.edu.tw/page/151" target="_blank" rel="noopener">cmuscmr.cmu.edu.tw</a>) — là nguồn đối chiếu tên gọi, loài và hình thái; nên so sánh thêm khi dùng nghiêm túc.</li>'+
  '<li><b>Đối chiếu ngày 18/11/2026:</b> '+(H.length-Object.keys(UNV).length)+'/'+H.length+' vị đã được so với Dược điển Trung Quốc 2020 (loài gốc, tính, vị, quy kinh, liều, nhãn độc, câu kiêng kỵ) qua bản trích của Shennong Alpha (Đại học Westlake) hoặc bản quét trang in Dược điển do bên thứ ba lưu trữ (đọc bằng mắt, có thể sai dấu câu) — không phải nguồn chính thức của Ủy ban Dược điển, <u>chưa so với sách in</u>. '+Object.keys(UNV).length+' vị chưa tìm được nguyên văn nên ghi rõ ‘chưa đối chiếu’. Bản 《中華藥典》 Đài Loan <u>chưa</u> đối chiếu.</li>'+
  '<li>Dữ liệu hoạt chất và nghiên cứu: các tổng quan khoa học tiền lâm sàng/lâm sàng công bố; chỉ nêu ở mức mô tả, không khẳng định hiệu quả điều trị.</li></ul>'+
  '<h2>Cách đọc tính – vị – quy kinh</h2><table><tr><th>Tính (性)</th><td><span class="tag hot">Nóng</span> <span class="tag warm">Ấm</span> <span class="tag neutral">Bình</span> <span class="tag cold">Mát / Lạnh</span> — mô tả khuynh hướng làm ấm hay làm mát cơ thể, không phải nhiệt độ thực.</td></tr>'+
  '<tr><th>Vị (味)</th><td>Cay, ngọt, chua, đắng, mặn (+ nhạt, chát); mỗi vị gắn với một kiểu tác dụng (cay: tán, ngọt: bổ…).</td></tr>'+
  '<tr><th>Quy kinh (歸經)</th><td>Các tạng phủ/đường kinh mà vị thuốc ‘hướng tới’ trong lý luận Trung y.</td></tr></table>'+
  '<h2>Miễn trừ trách nhiệm</h2><p>Thông tin chỉ phục vụ học tập và tham khảo văn hóa – dược học; <b>không phải lời khuyên y tế</b>. Dược liệu có thể tương tác với thuốc, gây dị ứng, có độc hoặc không an toàn khi mang thai/cho con bú. Hãy hỏi thầy thuốc hoặc dược sĩ có chuyên môn trước khi dùng. Tuyệt đối không tự điều trị bệnh nặng (sốt rét, ung thư, tim mạch, đái tháo đường…) bằng dược liệu thay cho điều trị y khoa.</p>'+
  '<h2>Nguồn ảnh &amp; giấy phép</h2><p class="cred">Toàn bộ ảnh lấy từ Wikimedia Commons (giấy phép Creative Commons hoặc phạm vi công cộng), đã thu nhỏ và nén WebP. Vui lòng giữ ghi công khi sử dụng lại. Với Hoàng liên và Trạch tả, ảnh là loài cùng chi (xem chú thích dưới ảnh).</p><ul class="cred">'+rows+'</ul>'+
  '<p><a class="btn" href="'+BASE+'">← Về tra cứu</a></p></div>';
  window.scrollTo({top:0,behavior:"instant"});enter();
}

/* Địa chỉ gọn, không dùng dấu #: /ma-xi-hien (vị thuốc), /gioi-thieu, gốc = danh sách.
   Vẫn nhận link cũ #/h/id, #id, #/about và tự đổi sang địa chỉ mới. */
function pathKey(){
  var p=location.pathname,k=p.indexOf(BASE)===0?p.slice(BASE.length):"";
  k=k.replace(/^index\.html$/,"").replace(/\/+$/,"");
  if(!k&&location.hash){
    k=location.hash.replace(/^#\/?/,"").replace(/^h\//,"").replace(/\/$/,"");
    if(k==="about")k="gioi-thieu";
    if(byId[k]||k==="gioi-thieu")history.replaceState(null,"",BASE+k);else k="";
  }
  return k;
}
function route(){
  var k=pathKey();
  document.querySelectorAll("[data-nav]").forEach(function(a){a.classList.toggle("on",(a.dataset.nav==="about")===(k==="gioi-thieu"));});
  if(byId[k])renderDetail(k);
  else if(k==="gioi-thieu")renderAbout();
  else {document.title="Trung Thảo Dược · Tra cứu dược liệu";renderList();}
}
window.addEventListener("popstate",route);
window.addEventListener("hashchange",route);
document.addEventListener("click",function(e){
  var a=e.target.closest&&e.target.closest("a[href]");
  if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target)return;
  var u=new URL(a.href,location.href);
  if(u.origin!==location.origin||u.pathname.indexOf(BASE)!==0||u.hash)return;
  var k=u.pathname.slice(BASE.length).replace(/\/+$/,"");
  if(k===""||k==="gioi-thieu"||byId[k]){
    e.preventDefault();
    if(u.pathname!==location.pathname)history.pushState(null,"",u.pathname);
    route();
  }
});

app.addEventListener("input",function(e){
  if(e.target.id==="q"){st.q=e.target.value;saveSt();refreshGrid();
    var b=document.getElementById("clr");var box=e.target.parentNode;
    if(st.q&&!b){b=document.createElement("button");b.id="clr";b.setAttribute("aria-label","Xóa");b.textContent="×";box.appendChild(b);}
    else if(!st.q&&b)b.remove();}
});
app.addEventListener("change",function(e){if(e.target.id==="sort"){st.sort=e.target.value;saveSt();refreshGrid();}});
app.addEventListener("click",function(e){
  var t=e.target.closest("button"); if(!t)return;
  if(t.id==="clr"){st.q="";saveSt();renderList();document.getElementById("q").focus();return;}
  if(t.dataset.g){st.g=t.dataset.g;st.fav=false;st.tox=false;saveSt();renderList();return;}
  if(t.dataset.toxf){st.tox=!st.tox;if(st.tox){st.g="all";st.fav=false;}saveSt();renderList();return;}
  if(t.dataset.favf){st.fav=!st.fav;if(st.fav)st.g="all";saveSt();renderList();return;}
  if(t.dataset.fav){e.preventDefault();var id=t.dataset.fav;if(favs[id])delete favs[id];else favs[id]=1;saveFavs();
    if(byId[pathKey()])renderDetail(id);else refreshGrid();}
});

/* nghiêng 3D theo con trỏ */
if(window.matchMedia&&matchMedia("(hover:hover)").matches&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
  app.addEventListener("pointermove",function(e){var c=e.target.closest&&e.target.closest(".card");if(!c||!c.classList.contains("in"))return;
    var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    c.style.setProperty("--ry",(x*10).toFixed(1)+"deg");c.style.setProperty("--rx",(-y*10).toFixed(1)+"deg");c.style.transitionDelay="0ms";});
  app.addEventListener("pointerout",function(e){var c=e.target.closest&&e.target.closest(".card");if(c){c.style.setProperty("--ry","0deg");c.style.setProperty("--rx","0deg");}});
}

route();

if("serviceWorker" in navigator){
  window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){});});
}
})();
