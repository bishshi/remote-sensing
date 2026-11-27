const Exercises=(()=>{
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function render(root,chapter,typeset){
  root.innerHTML=`<p class="feature-intro">按章节复习，共 72 题。先独立作答，再展开答案与解析；题目依据教材及课程资料编写，并非教师原题。</p><div class="exercise-toolbar"><label>选择章节 <select id="exercise-chapter">${CHAPTER_EXERCISES.map((c,i)=>`<option value="${i+1}">${esc(c.title)}</option>`).join('')}</select></label><span id="exercise-count"></span></div><div id="exercise-list"></div>`;
  const sel=root.querySelector('#exercise-chapter');sel.value=String(chapter);
  function update(){
   const n=Number(sel.value),data=CHAPTER_EXERCISES[n-1];root.querySelector('#exercise-count').textContent=`本章 ${data.items.length} 题`;
   root.querySelector('#exercise-list').innerHTML=data.items.map((q,i)=>{
    const answers=q.choices.length?`<fieldset class="exercise-options"><legend>选择答案</legend>${q.choices.map((v,j)=>`<label><input type="radio" name="exercise-${n}-${i}" value="${'ABCD'[j]}"> <span>${'ABCD'[j]}. ${esc(v)}</span></label>`).join('')}</fieldset>`:'';
    const answer=q.answer?`<p><b>参考答案：</b>${esc(q.answer)}</p>`:'';
    return `<article class="exercise-item"><div class="exercise-meta">第 ${i+1} 题 · ${esc(q.type)}</div><p class="exercise-question">${esc(q.question)}</p>${answers}<details class="exercise-answer"><summary>查看答案与解析</summary>${answer}<p><b>解析：</b>${esc(q.explanation)}</p></details></article>`;
   }).join('');
   root.querySelectorAll('.exercise-answer').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)typeset()}));typeset();
  }
  sel.addEventListener('change',update);update();
 }
 return {render};
})();
