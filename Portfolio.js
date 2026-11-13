 /* ---------- filter ---------- */
  const chips = document.querySelectorAll('#pfFilters .chip');
  const cards = document.querySelectorAll('.pf-card');
  chips.forEach(chip=>{
    chip.addEventListener('click', ()=>{
      chips.forEach(c=>c.classList.remove('on'));
      chip.classList.add('on');
      const f = chip.dataset.filter;
      cards.forEach(card=>{
        card.classList.toggle('hide', f !== 'all' && card.dataset.cat !== f);
      });
    });
  });

  /* ---------- popup ---------- */
  const modal = document.getElementById('pfModal');
  const stage = document.getElementById('pfStage');
  let slides = [], idx = 0;

  function renderSlide(){
    stage.querySelector('img').src = slides[idx];
    stage.querySelectorAll('.pf-dots i').forEach((d,i)=>d.classList.toggle('on', i===idx));
  }
  function go(step){ idx = (idx + step + slides.length) % slides.length; renderSlide(); }

  function openModal(card){
    document.getElementById('pfCat').textContent   = card.querySelector('.cat').textContent;
    document.getElementById('pfTitle').textContent = card.querySelector('h3').textContent;
    document.getElementById('pfDesc').textContent  = card.querySelector('p').textContent;
    stage.innerHTML = '';
    slides = []; idx = 0;

    if(card.dataset.video){
      stage.innerHTML = '<iframe src="'+card.dataset.video+'" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
    } else if(card.dataset.images){
      slides = card.dataset.images.split(',').map(s=>s.trim());
      stage.innerHTML = '<img alt="">';
      if(slides.length > 1){
        stage.insertAdjacentHTML('beforeend',
          '<button class="pf-arrow pf-prev" aria-label="Previous">‹</button>'+
          '<button class="pf-arrow pf-next" aria-label="Next">›</button>'+
          '<div class="pf-dots">'+slides.map(()=>'<i></i>').join('')+'</div>');
        stage.querySelector('.pf-prev').onclick = ()=>go(-1);
        stage.querySelector('.pf-next').onclick = ()=>go(1);
        stage.querySelectorAll('.pf-dots i').forEach((d,i)=>d.onclick = ()=>{ idx=i; renderSlide(); });
      }
      renderSlide();
    }
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    stage.innerHTML = '';          // video band ho jaye
    document.body.style.overflow = 'auto';
  }

  cards.forEach(card=>{
    card.addEventListener('click', ()=>openModal(card));
    card.addEventListener('keydown', e=>{ if(e.key==='Enter') openModal(card); });
  });
  document.getElementById('pfClose').addEventListener('click', closeModal);
  modal.addEventListener('click', e=>{ if(e.target===modal) closeModal(); });
  document.addEventListener('keydown', e=>{
    if(!modal.classList.contains('open')) return;
    if(e.key==='Escape') closeModal();
    if(e.key==='ArrowRight' && slides.length>1) go(1);
    if(e.key==='ArrowLeft'  && slides.length>1) go(-1);
  });

 