/* Study aids: chapter reviews are derived from the site's source-labeled study notes. */
const Study=(()=>{
const chapters=[
 {name:'遥感概述',topics:['遥感信息链','主动与被动','3S 集成']},
 {name:'电磁辐射基础',topics:['黑体辐射','大气窗口','地物光谱']},
 {name:'传感器',topics:['四种分辨率','扫描与推扫','成像光谱仪']},
 {name:'航空遥感',topics:['中心投影','像片比例尺','无人机遥感']},
 {name:'航天遥感',topics:['卫星轨道','陆地卫星','气象与海洋']},
 {name:'微波与激光雷达',topics:['SAR 成像','距离与方位分辨率','LiDAR 测距']},
 {name:'图像校正与增强',topics:['辐射与几何校正','重采样','图像增强']},
 {name:'遥感图像解译',topics:['监督与非监督分类','机器学习','精度评价']},
 {name:'遥感技术应用',topics:['资源调查','灾害监测','变化检测']}
];
const graphNodes=[
 {id:'rad',label:'电磁辐射',chapter:2,x:90,y:105,desc:'信息载体；地物与辐射的相互作用形成遥感信号。'},
 {id:'atm',label:'大气作用',chapter:2,x:265,y:65,desc:'吸收、散射与透射影响传感器接收到的信号。'},
 {id:'spectrum',label:'地物光谱',chapter:2,x:265,y:170,desc:'不同地物的光谱差异为识别与反演提供依据。'},
 {id:'sensor',label:'传感器',chapter:3,x:440,y:65,desc:'记录电磁信号；性能受空间、光谱、辐射和时间分辨率共同影响。'},
 {id:'platform',label:'遥感平台',chapter:5,x:615,y:65,desc:'航空与航天平台搭载传感器，决定覆盖、轨道与观测条件。'},
 {id:'sar',label:'SAR / LiDAR',chapter:6,x:615,y:170,desc:'主动观测方式；SAR 测量微波回波，LiDAR 利用激光测距。'},
 {id:'correct',label:'图像校正',chapter:7,x:90,y:300,desc:'辐射校正处理像元值误差；几何校正处理空间位置误差。'},
 {id:'resample',label:'重采样',chapter:7,x:265,y:300,desc:'几何变换后估计输出格网像元值，常用最近邻与双线性。'},
 {id:'classify',label:'图像分类',chapter:8,x:440,y:300,desc:'利用光谱或其他特征将像元或对象分配到类别。'},
 {id:'accuracy',label:'精度评价',chapter:8,x:615,y:300,desc:'借助独立验证样本和混淆矩阵评价分类结果。'},
 {id:'change',label:'变化监测',chapter:9,x:265,y:425,desc:'通过多时相数据识别变化，依赖配准、时相一致性和验证。'},
 {id:'hazard',label:'灾害应用',chapter:9,x:520,y:425,desc:'以监测范围、评估灾情和辅助响应为目标整合多源信息。'}
];
const graphEdges=[['rad','atm','传播受影响'],['rad','spectrum','与地物相互作用'],['spectrum','sensor','信号被记录'],['atm','correct','辐射影响需处理'],['platform','sensor','搭载'],['platform','sar','搭载观测系统'],['sar','hazard','提供多源观测'],['sensor','correct','数据进入预处理'],['correct','resample','几何校正需要'],['correct','classify','预处理支持分类'],['spectrum','classify','光谱特征支持分类'],['classify','accuracy','分类后评价'],['correct','change','配准支持对比'],['classify','change','可做分类后比较'],['change','hazard','识别灾前灾后变化']];
let cardsCache, filter='all',remaining=[],lastCard=null;
function escapeText(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function cards(){if(cardsCache)return cardsCache;cardsCache=[];SECTIONS.slice(1,10).forEach((sec,i)=>{const root=document.createElement('div');root.innerHTML=sec.html;root.querySelectorAll('.review details').forEach((item,j)=>{const question=item.querySelector('summary')?.textContent.trim();const answer=[...item.querySelectorAll('p')].map(p=>p.textContent.trim()).join('\n');if(question&&answer)cardsCache.push({id:`${i+1}-${j}`,chapter:i+1,question,answer})})});return cardsCache}
function selector(){return '<label class="filter-label">筛选章节 <select id="card-filter"><option value="all">全部章节</option>'+chapters.map((c,i)=>`<option value="${i+1}">第 ${i+1} 章 ${escapeText(c.name)}</option>`).join('')+'</select></label>'}
function getPool(){return cards().filter(c=>filter==='all'||c.chapter===Number(filter))}
function bindFilter(root,update){const el=root.querySelector('#card-filter');el.value=filter;el.addEventListener('change',()=>{filter=el.value;remaining=[];lastCard=null;update()})}
function renderMind(root,ctx){let groups=[['基础与观测',chapters.slice(0,3),0],['平台与成像',chapters.slice(3,6),3],['处理与应用',chapters.slice(6,9),6]];root.innerHTML='<p class="feature-intro">沿着“基础 → 获取 → 处理与应用”展开知识结构；点击章节进入对应学习笔记。</p><div class="mind-viewport" tabindex="0" aria-label="思维导图，可横向滚动"><div class="mind-map"><div class="mind-root">遥感概论<small>知识框架</small></div><div class="mind-groups">'+groups.map(([name,items,offset],g)=>`<div class="mind-group group-${g}"><div class="mind-group-title">${name}</div><div class="mind-branches">${items.map((c,i)=>`<details open><summary>${offset+i+1}. ${escapeText(c.name)}</summary><div class="mind-leaves">${c.topics.map(t=>`<span>${escapeText(t)}</span>`).join('')}<button data-jump="${offset+i+1}">查看章节</button></div></details>`).join('')}</div></div>`).join('')+'</div></div></div><p class="feature-hint">手机可左右滑动导图；点击章节标题可折叠分支。</p>';bindJump(root,ctx)}
function bindJump(root,ctx){root.querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click',()=>ctx.jumpChapter(Number(b.dataset.jump))))}
function renderGraph(root,ctx){let byId=Object.fromEntries(graphNodes.map(n=>[n.id,n]));root.innerHTML='<p class="feature-intro">点击节点，查看它与其他知识点的关系，再跳转到对应章节。连线表示学习关系，并非因果定律或完整知识网络。</p><div class="graph-viewport" tabindex="0" aria-label="知识图谱，可横向滚动"><svg class="knowledge-graph" viewBox="0 0 710 490" role="img" aria-label="遥感课程知识关系图">'+graphEdges.map(([a,b])=>{let x=byId[a],y=byId[b];return `<line x1="${x.x}" y1="${x.y}" x2="${y.x}" y2="${y.y}"/>`}).join('')+graphNodes.map(n=>`<g role="button" tabindex="0" aria-label="查看${n.label}" data-node="${n.id}"><circle cx="${n.x}" cy="${n.y}" r="46"/><text x="${n.x}" y="${n.y}" text-anchor="middle" dominant-baseline="middle">${n.label}</text></g>`).join('')+'</svg></div><div id="graph-detail" class="graph-detail" aria-live="polite"></div><p class="feature-hint">手机可左右滑动图谱；键盘可使用 Tab 和回车选择节点。</p>';function choose(id){let n=byId[id];root.querySelectorAll('[data-node]').forEach(e=>e.classList.toggle('node-selected',e.dataset.node===id));let links=graphEdges.filter(e=>e[0]===id||e[1]===id).map(([a,b,r])=>`<li>${escapeText(byId[a].label)} — ${escapeText(r)} — ${escapeText(byId[b].label)}</li>`).join('');root.querySelector('#graph-detail').innerHTML=`<div><b>${escapeText(n.label)}</b><p>${escapeText(n.desc)}</p><ul>${links}</ul></div><button class="primary-button" data-jump="${n.chapter}">进入第 ${n.chapter} 章</button>`;bindJump(root,ctx)}root.querySelectorAll('[data-node]').forEach(el=>{el.addEventListener('click',()=>choose(el.dataset.node));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(el.dataset.node)}})});choose('rad')}
function renderCards(root,ctx){root.innerHTML='<p class="feature-intro">基于各章已整理的思考题要点；先回忆，再展开答案。题目为教材思考题的重述，详细来源请查看对应章节。</p><div class="cards-toolbar">'+selector()+'<span id="card-count"></span></div><div id="card-list" class="flash-grid"></div>';function update(){let pool=getPool();root.querySelector('#card-count').textContent=`共 ${pool.length} 张卡片`;root.querySelector('#card-list').innerHTML=pool.map(c=>`<details class="flash-card"><summary><small>第 ${c.chapter} 章 · ${escapeText(chapters[c.chapter-1].name)}</small><b>${escapeText(c.question)}</b><span>点击查看答案</span></summary><p>${escapeText(c.answer)}</p><button data-jump="${c.chapter}">查看对应章节</button></details>`).join('')||'<p>此章节暂时没有卡片。</p>';bindJump(root,ctx)}bindFilter(root,update);update()}
function draw(){const pool=getPool();if(!pool.length)return null;if(!remaining.length){remaining=pool.map(x=>x.id);if(remaining.length>1&&lastCard){const index=remaining.indexOf(lastCard);if(index>=0){remaining.splice(index,1);remaining.unshift(lastCard)}}}let index=Math.floor(Math.random()*remaining.length);if(remaining.length>1&&remaining[index]===lastCard)index=(index+1)%remaining.length;const id=remaining.splice(index,1)[0];lastCard=id;return pool.find(x=>x.id===id)}
function renderRandom(root,ctx){root.innerHTML='<p class="feature-intro">先尝试回答，再翻开答案。每轮会抽完当前范围内的卡片，再进入下一轮。</p><div class="cards-toolbar">'+selector()+'<button class="primary-button" id="next-card">抽取下一张</button></div><div id="random-card"></div>';function next(){const c=draw(),box=root.querySelector('#random-card');if(!c){box.textContent='当前没有可抽取的卡片。';return}box.innerHTML=`<div class="random-card"><small>第 ${c.chapter} 章 · ${escapeText(chapters[c.chapter-1].name)}</small><h2>${escapeText(c.question)}</h2><details><summary>显示答案</summary><p>${escapeText(c.answer)}</p></details><div class="random-actions"><button data-jump="${c.chapter}">查看章节</button><span>本轮剩余 ${remaining.length} 张</span></div></div>`;bindJump(root,ctx)}bindFilter(root,next);root.querySelector('#next-card').addEventListener('click',next);next()}
function render(view,root,ctx){if(view==='mind')renderMind(root,ctx);else if(view==='graph')renderGraph(root,ctx);else if(view==='cards')renderCards(root,ctx);else if(view==='random')renderRandom(root,ctx)}
return {render,chapters,graphNodes,graphEdges,draw,cards};})();
