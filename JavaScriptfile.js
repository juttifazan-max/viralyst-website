// /* ---------------- 0. Force Scroll to Top on Refresh ---------------- */
//  if ('scrollRestoration' in history) {
//    history.scrollRestoration = 'manual';
// }
//  window.scrollTo(0, 0);

/* ---------------- preloader ---------------- */
window.addEventListener('load',()=>{
  setTimeout(()=>{
    document.getElementById('preloader').classList.add('hide');
    document.body.style.overflow='auto';
  }, 2650);
});
document.body.style.overflow='hidden';
setTimeout(()=>{ document.body.style.overflow='auto'; }, 2700);

/* ---------------- custom cursor ---------------- */
// const cursor = document.getElementById('cursor');
// let mx=0,my=0,cx=0,cy=0,cursorStarted=false;
// window.addEventListener('mousemove', e=>{
//   mx=e.clientX; my=e.clientY;
//   if(!cursorStarted){ cursorStarted=true; cx=mx; cy=my; cursor.classList.add('show'); }
// });
// function loop(){
//   cx += (mx-cx)*0.22; cy += (my-cy)*0.22;
//   cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
//   requestAnimationFrame(loop);
// }
// loop();
// document.querySelectorAll('a, button, .magnetic, .chip, input, textarea').forEach(el=>{
//   el.addEventListener('mouseenter', ()=>cursor.classList.add('big'));
//   el.addEventListener('mouseleave', ()=>cursor.classList.remove('big'));
// });

/* ---------------- header hide on scroll ---------------- */
let lastY = window.scrollY;
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', ()=>{
  const y = window.scrollY;
  if(y > lastY && y > 200){ header.classList.add('hidden'); }
  else { header.classList.remove('hidden'); }
  lastY = y;
}, {passive:true});

/* ---------------- reveal on scroll ---------------- */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){ entry.target.classList.add('in'); }
  });
}, {threshold:0.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ---------------- hero service engine ---------------- */
const engineWords = document.querySelectorAll('.engine-word');
function activateEngineWord(word){
  engineWords.forEach(w=>{
    w.classList.remove('active'); w.classList.add('dim');
  });
  word.classList.add('active'); word.classList.remove('dim');
}
engineWords.forEach(word=>{
  word.addEventListener('mouseenter', ()=>activateEngineWord(word));
  word.addEventListener('click', ()=>activateEngineWord(word));
});
if (window.matchMedia('(hover: hover)').matches) {
    document.getElementById('services').addEventListener('mouseleave', ()=>{
        engineWords.forEach((w,i)=>{
            w.classList.toggle('active', i===0);
            w.classList.toggle('dim', i!==0);
        });
    });
}

/* ---------------- attention stretch effect ---------------- */
const stretchEl = document.getElementById('stretchText');
const attentionSection = document.querySelector('.attention');
window.addEventListener('scroll', ()=>{
  const rect = attentionSection.getBoundingClientRect();
  const vh = window.innerHeight;
  const progress = Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1);
  const spacing = 0.02 + progress*0.08;
  stretchEl.style.letterSpacing = spacing + 'em';
}, {passive:true});

/* ---------------- hero background: flowing light ribbons ---------------- */
(function(){
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  const heroSection = document.getElementById('hero');
  let w,h,dpr;
  function resize(){
    dpr = Math.min(window.devicePixelRatio||1, 2);
    w = heroSection.offsetWidth; h = heroSection.offsetHeight;
    canvas.width = w*dpr; canvas.height = h*dpr;
    canvas.style.width=w+'px'; canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  window.addEventListener('resize', resize);

  const ribbons = Array.from({length:5}, (_,i)=>({
    baseY: 0.18 + i*0.16 + Math.random()*0.05,
    amp: 40 + Math.random()*46,
    freq: 0.9 + Math.random()*0.7,
    speed: 0.22 + Math.random()*0.18,
    phase: Math.random()*Math.PI*2,
    width: 1.4 + Math.random()*2.2,
    hue: i%2===0 ? [74,114,199] : [98,168,221]
  }));

  let mouseYNorm = 0.5, targetMouseYNorm = 0.5;
  heroSection.addEventListener('mousemove', e=>{
    targetMouseYNorm = e.clientY / h;
  });

  let t = 0;
  function draw(){
    t += 1;
    mouseYNorm += (targetMouseYNorm - mouseYNorm) * 0.04;
    ctx.clearRect(0,0,w,h);
    ribbons.forEach((r,i)=>{
      ctx.beginPath();
      const yShift = (mouseYNorm-0.5) * 26 * (i%2===0?1:-1);
      const baseY = h * r.baseY + yShift;
      for(let x=0; x<=w; x+=8){
        const y = baseY + Math.sin(x*0.0028*r.freq + t*0.008*r.speed + r.phase) * r.amp
                 + Math.sin(x*0.0009 + t*0.004) * r.amp*0.35;
        if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      const grad = ctx.createLinearGradient(0,0,w,0);
      const [cr,cg,cb] = r.hue;
      grad.addColorStop(0, `rgba(${cr},${cg},${cb},0)`);
      grad.addColorStop(0.18, `rgba(${cr},${cg},${cb},0.55)`);
      grad.addColorStop(0.5, `rgba(${Math.min(cr+40,255)},${Math.min(cg+40,255)},${Math.min(cb+30,255)},0.85)`);
      grad.addColorStop(0.82, `rgba(${cr},${cg},${cb},0.55)`);
      grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = r.width;
      ctx.shadowColor = `rgba(${cr},${cg},${cb},0.9)`;
      ctx.shadowBlur = 14;
      ctx.stroke();
    });
    requestAnimationFrame(draw);
  }
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){ draw(); }
})();

/* ghost mark parallax */
const heroGhost = document.getElementById('heroGhost');
if(heroGhost){
  document.getElementById('hero').addEventListener('mousemove', e=>{
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left)/r.width - 0.5;
    const py = (e.clientY - r.top)/r.height - 0.5;
    heroGhost.style.transform = `translateY(calc(-50% + ${py*-18}px)) translateX(${px*-14}px) rotate(${px*2}deg)`;
  });
}

/* ---------------- build repeating visual bits ---------------- */


const designViz = document.getElementById('designViz');
const canvases = [
  {w:'52%',h:'70%',top:'4%',left:'0%',rot:-4,c:'linear-gradient(135deg,var(--blue-1),var(--blue-2))'},
  {w:'44%',h:'54%',top:'30%',left:'40%',rot:5,c:'linear-gradient(135deg,#1a1a1a,#2a2a2a)'},
  {w:'34%',h:'40%',top:'54%',left:'12%',rot:-8,c:'linear-gradient(135deg,var(--blue-2),var(--blue-1))'}
];
canvases.forEach(cfg=>{
  const el = document.createElement('div');
  el.className='canvas';
  Object.assign(el.style,{width:cfg.w,height:cfg.h,top:cfg.top,left:cfg.left,transform:`rotate(${cfg.rot}deg)`});
  el.innerHTML = `<div class="swatch" style="background:${cfg.c}"></div>`;
  designViz.appendChild(el);
});

/* ---------------- portfolio index tracking ---------------- */
const cases = document.querySelectorAll('.case');
const navButtons = document.querySelectorAll('.portfolio-nav button');
const cio = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navButtons.forEach(b=>b.classList.toggle('active', b.dataset.target===entry.target.id));
    }
  });
},{threshold:0.5});
cases.forEach(c=>cio.observe(c));
navButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.getElementById(btn.dataset.target).scrollIntoView({behavior:'smooth'});
  });
});

/* ---------------- chip selection ---------------- */
document.querySelectorAll('#serviceChips .chip').forEach(chip=>{
  chip.addEventListener('click', ()=>chip.classList.toggle('on'));
});
document.querySelectorAll('#budgetChips .chip').forEach(chip=>{
  chip.addEventListener('click', ()=>{
    document.querySelectorAll('#budgetChips .chip').forEach(c=>c.classList.remove('on'));
    chip.classList.add('on');
  });
});

/* ---------------- form submit feedback ---------------- */
document.getElementById('submitBtn').addEventListener('click', ()=>{
  const btn = document.getElementById('submitBtn');
  btn.firstChild.textContent = 'Inquiry Sent ';
});

/* ---------------- magnetic buttons ---------------- */
document.querySelectorAll('.magnetic').forEach(el=>{
  el.addEventListener('mousemove', e=>{
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    el.style.transform = `translate(${x*0.18}px, ${y*0.3}px)`;
  });
  el.addEventListener('mouseleave', ()=>{ el.style.transform='translate(0,0)'; });
});
/* ---------------- video timeline bars ---------------- */
const videoTimeline = document.getElementById('videoTimeline');
if(videoTimeline){
  for(let i=0;i<26;i++){
    const bar = document.createElement('i');
    bar.style.animationDelay = (i * 0.08) + 's';
    videoTimeline.appendChild(bar);
  }
} 