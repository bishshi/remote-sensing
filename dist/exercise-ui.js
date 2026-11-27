const Exercises=(()=>{
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const KEY='remote-sensing-exercise-mistakes-v1';let wrong={};try{wrong=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{wrong={}}
 function persist(){try{localStorage.setItem(KEY,JSON.stringify(wrong));return true}catch{return false}}
 function idFor(n,i){return `${n}-${i}`}
 function validRecord(record,q){return record&&record.question===q.question&&record.answer===q.answer}
 function render(root,chapter,typeset){
  const total=CHAPTER_EXERCISES.reduce((s,c)=>s+c.items.length,0);
  root.innerHTML=`<p class="feature-intro">按章节复习，共 ${total} 题。选择题和判断题可即时检查；答错会记录到本机错题。其他题型请自行作答后对照解析，题目并非教师原题。</p><div class="exercise-toolbar"><label>选择章节 <select id="exercise-chapter">${CHAPTER_EXERCISES.map((c,i)=>`<option value="${i+1}">${esc(c.title)}</option>`).join('')}</select></label><label><input type="checkbox" id="exercise-wrong-only"> 只看本章错题</label><span id="exercise-count"></span></div><p class="exercise-storage" id="exercise-storage">错题记录仅保存在当前浏览器，不会自动同步到其他设备。</p><div id="exercise-list"></div>`;
  const sel=root.querySelector('#exercise-chapter'),only=root.querySelector('#exercise-wrong-only');sel.value=String(chapter);
  function update(){
   const n=Number(sel.value),data=CHAPTER_EXERCISES[n-1],visible=data.items.map((q,i)=>({q,i})).filter(({q,i})=>!only.checked||validRecord(wrong[idFor(n,i)],q));root.querySelector('#exercise-count').textContent=`本章 ${data.items.length} 题 · 当前显示 ${visible.length} 题`;
   root.querySelector('#exercise-list').innerHTML=visible.map(({q,i})=>{
    const judge=q.type==='判断'&&['对','错'].includes(q.answer),options=q.choices.length?q.choices.map((text,j)=>({value:'ABCD'[j],label:`${'ABCD'[j]}. ${text}`})):judge?[{value:'对',label:'对'},{value:'错',label:'错'}]:[];
    const auto=options.length>0&&((judge)||(['A','B','C','D'].includes(q.answer)&&q.choices.length>0));
    const answers=auto?`<fieldset class="exercise-options"><legend>选择答案</legend>${options.map(v=>`<label><input type="radio" name="exercise-${n}-${i}" value="${esc(v.value)}"> <span>${esc(v.label)}</span></label>`).join('')}</fieldset><div class="exercise-actions"><button class="exercise-check" data-check="${i}">检查答案</button><span role="status" id="feedback-${i}" class="exercise-feedback"></span></div>`:'';
    const answer=q.answer?`<p><b>参考答案：</b>${esc(q.answer)}</p>`:'';const marked=validRecord(wrong[idFor(n,i)],q)?'<span class="wrong-badge">待重练</span>':'';
    return `<article class="exercise-item" data-index="${i}"><div class="exercise-meta">第 ${i+1} 题 · ${esc(q.type)} ${marked}</div><p class="exercise-question">${esc(q.question)}</p>${answers}<details class="exercise-answer"><summary>查看答案与解析</summary>${answer}<p><b>解析：</b>${esc(q.explanation)}</p></details></article>`;
   }).join('')||'<p class="empty-review">本章没有记录的错题。选择题或判断题答错后会自动加入。</p>';
   root.querySelectorAll('[data-check]').forEach(btn=>btn.addEventListener('click',()=>{let i=Number(btn.dataset.check),q=data.items[i],item=btn.closest('.exercise-item'),input=item.querySelector('input:checked'),feedback=item.querySelector('.exercise-feedback');if(!input){feedback.textContent='请先选择答案。';return}let correct=input.value===q.answer,key=idFor(n,i);if(correct){delete wrong[key];feedback.textContent='回答正确！';feedback.className='exercise-feedback correct'}else{wrong[key]={question:q.question,answer:q.answer};feedback.textContent='回答有误，可再试一次或查看解析。';feedback.className='exercise-feedback incorrect'}if(!persist())root.querySelector('#exercise-storage').textContent='当前浏览器未能保存错题记录，本次练习结束后可能丢失。';let meta=item.querySelector('.exercise-meta'),badge=meta.querySelector('.wrong-badge');if(correct&&badge)badge.remove();if(!correct&&!badge)meta.insertAdjacentHTML('beforeend',' <span class="wrong-badge">待重练</span>');if(correct&&only.checked){item.insertAdjacentHTML('beforeend','<p class="review-cleared">已答对；切换筛选或章节后将从错题列表移除。</p>')}}));
   root.querySelectorAll('.exercise-answer').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)typeset()}));typeset();
  }
  sel.addEventListener('change',update);only.addEventListener('change',update);update();
 }
 return {render};
})();
