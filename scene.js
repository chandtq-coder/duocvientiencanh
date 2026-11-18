/* Cảnh nền tiên cảnh: núi sương thị sai, đom đóm, cánh hoa rơi, âm thanh nền tùy chọn */
(function(){
"use strict";
var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
var root=document.documentElement;

/* ---------- chủ đề sáng / tối ---------- */
var themeBtn=document.getElementById("themeBtn");
function isDark(){var t=root.getAttribute("data-theme");return t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;}
function paintTheme(){if(themeBtn){themeBtn.textContent=isDark()?"☀":"☾";themeBtn.setAttribute("aria-label",isDark()?"Chuyển sang ban ngày":"Chuyển sang ban đêm");}
  var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=isDark()?"#07181c":"#2f8f72";}
try{var sv=localStorage.getItem("ttd-theme");if(sv)root.setAttribute("data-theme",sv);}catch(e){}
paintTheme();
if(themeBtn)themeBtn.addEventListener("click",function(){var n=isDark()?"light":"dark";root.setAttribute("data-theme",n);try{localStorage.setItem("ttd-theme",n);}catch(e){}paintTheme();});

/* ---------- thị sai khi cuộn ---------- */
var layers=[].slice.call(document.querySelectorAll("[data-par]")),ticking=false;
function par(){ticking=false;var y=window.scrollY||0;layers.forEach(function(l){l.style.transform="translate3d(0,"+(-y*parseFloat(l.dataset.par)).toFixed(1)+"px,0)";});}
if(!reduce)window.addEventListener("scroll",function(){if(!ticking){ticking=true;requestAnimationFrame(par);}},{passive:true});

/* ---------- đom đóm & cánh hoa ---------- */
var cv=document.getElementById("fx");
if(cv&&!reduce){
  var cx=cv.getContext("2d"),W=0,Hh=0,dpr=Math.min(window.devicePixelRatio||1,1.5),P=[],t0=0,run=true;
  var mx=-999,my=-999;
  window.addEventListener("pointermove",function(e){mx=e.clientX;my=e.clientY;},{passive:true});
  function size(){W=innerWidth;Hh=innerHeight;cv.width=W*dpr;cv.height=Hh*dpr;cv.style.width=W+"px";cv.style.height=Hh+"px";cx.setTransform(dpr,0,0,dpr,0,0);}
  function mk(kind){return {k:kind,x:Math.random()*W,y:Math.random()*Hh,r:kind?3+Math.random()*4:1+Math.random()*2.2,
    s:.15+Math.random()*.5,ph:Math.random()*6.28,a:Math.random()*6.28,sp:(Math.random()-.5)*.03};}
  function seed(){P=[];var n=Math.round(Math.min(70,W*Hh/22000));for(var i=0;i<n;i++)P.push(mk(0));for(i=0;i<Math.round(n/4);i++)P.push(mk(1));}
  function frame(t){
    if(!run)return;requestAnimationFrame(frame);
    var dark=isDark();cx.clearRect(0,0,W,Hh);
    P.forEach(function(p){
      if(!p.k){ // đom đóm
        p.ph+=.012;p.x+=Math.sin(p.ph*1.3+p.a)*.35;p.y+=Math.cos(p.ph)*.3-p.s*.25;
        var dx=p.x-mx,dy=p.y-my,d=Math.sqrt(dx*dx+dy*dy);if(d<110){p.x+=dx/d*1.6;p.y+=dy/d*1.6;}
        if(p.y<-10)p.y=Hh+10;if(p.x<-10)p.x=W+10;if(p.x>W+10)p.x=-10;if(p.y>Hh+10)p.y=-10;
        var al=.35+.65*Math.abs(Math.sin(p.ph*.8)),g=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6);
        var c=dark?"255,220,120":"255,196,90";
        g.addColorStop(0,"rgba("+c+","+(al*(dark?.95:.7))+")");g.addColorStop(.25,"rgba("+c+","+(al*.35)+")");g.addColorStop(1,"rgba("+c+",0)");
        cx.fillStyle=g;cx.beginPath();cx.arc(p.x,p.y,p.r*6,0,6.28);cx.fill();
      }else{ // cánh hoa
        p.y+=p.s+.25;p.x+=Math.sin(p.ph)*.5+.25;p.ph+=.02;p.a+=p.sp;
        if(p.y>Hh+12){p.y=-12;p.x=Math.random()*W;}if(p.x>W+12)p.x=-12;
        cx.save();cx.translate(p.x,p.y);cx.rotate(p.a);cx.scale(1,.55+.45*Math.sin(p.ph));
        cx.fillStyle=dark?"rgba(255,170,200,.55)":"rgba(240,130,165,.62)";
        cx.beginPath();cx.ellipse(0,0,p.r*1.6,p.r,0,0,6.28);cx.fill();cx.restore();
      }
    });
  }
  size();seed();requestAnimationFrame(frame);
  window.addEventListener("resize",function(){size();seed();});
  document.addEventListener("visibilitychange",function(){if(document.hidden)run=false;else if(!run){run=true;requestAnimationFrame(frame);}});
}

/* ---------- âm thanh nền (tạo bằng WebAudio, mặc định tắt) ---------- */
var sndBtn=document.getElementById("sndBtn"),AC=null,master=null,timer=null,on=false;
var NOTES=[293.66,329.63,369.99,440,493.88,587.33,659.25]; // Rê trưởng ngũ cung
function pluck(f,vol){
  if(!AC)return;var t=AC.currentTime,o=AC.createOscillator(),o2=AC.createOscillator(),g=AC.createGain();
  o.type="triangle";o2.type="sine";o.frequency.value=f;o2.frequency.value=f*2.003;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol||.12,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+3.2);
  o.connect(g);o2.connect(g);g.connect(master);o.start(t);o2.start(t);o.stop(t+3.3);o2.stop(t+3.3);
}
function startAudio(){
  AC=AC||new (window.AudioContext||window.webkitAudioContext)();
  if(AC.state==="suspended")AC.resume();
  if(!master){
    master=AC.createGain();master.gain.value=.0;
    var dl=AC.createDelay(1);dl.delayTime.value=.37;var fb=AC.createGain();fb.gain.value=.38;var wet=AC.createGain();wet.gain.value=.4;
    master.connect(AC.destination);master.connect(dl);dl.connect(fb);fb.connect(dl);dl.connect(wet);wet.connect(AC.destination);
    // gió: nhiễu lọc thấp, âm lượng dao động chậm
    var len=AC.sampleRate*3,buf=AC.createBuffer(1,len,AC.sampleRate),d=buf.getChannelData(0),last=0;
    for(var i=0;i<len;i++){var w=Math.random()*2-1;last=(last+.02*w)/1.02;d[i]=last*3.5;}
    var ns=AC.createBufferSource();ns.buffer=buf;ns.loop=true;
    var lp=AC.createBiquadFilter();lp.type="lowpass";lp.frequency.value=520;
    var wg=AC.createGain();wg.gain.value=.05;
    var lfo=AC.createOscillator(),lg=AC.createGain();lfo.frequency.value=.11;lg.gain.value=.03;lfo.connect(lg);lg.connect(wg.gain);lfo.start();
    ns.connect(lp);lp.connect(wg);wg.connect(master);ns.start();
  }
  master.gain.cancelScheduledValues(AC.currentTime);master.gain.linearRampToValueAtTime(.9,AC.currentTime+1.5);
  (function next(){var n=NOTES[Math.floor(Math.random()*NOTES.length)];pluck(n,.07+Math.random()*.06);
    if(Math.random()<.3)setTimeout(function(){if(on)pluck(NOTES[Math.floor(Math.random()*NOTES.length)],.05);},260);
    timer=setTimeout(next,1800+Math.random()*3200);})();
}
function stopAudio(){clearTimeout(timer);if(master&&AC){master.gain.cancelScheduledValues(AC.currentTime);master.gain.linearRampToValueAtTime(0,AC.currentTime+.8);}}
function paintSnd(){if(sndBtn){sndBtn.textContent=on?"♫":"♪";sndBtn.setAttribute("aria-pressed",on);sndBtn.setAttribute("aria-label",on?"Tắt âm thanh vườn":"Bật âm thanh vườn");sndBtn.title=on?"Tắt âm thanh vườn":"Bật âm thanh vườn (gió + đàn)";}}
if(sndBtn)sndBtn.addEventListener("click",function(){on=!on;if(on)startAudio();else stopAudio();paintSnd();});
paintSnd();
window.TTD_chime=function(){if(on)pluck(NOTES[Math.floor(Math.random()*NOTES.length)]*2,.1);};
})();
