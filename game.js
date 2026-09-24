'use strict';
const products={Soda:{icon:'🥤',sell:2.49,cost:1,stock:6,max:10},Chips:{icon:'🍟',sell:1.99,cost:.8,stock:6,max:10},Candy:{icon:'🍫',sell:1.69,cost:.6,stock:6,max:10},Water:{icon:'💧',sell:1.79,cost:.55,stock:6,max:10}};
const state={money:500,day:1,served:0,profit:0,rep:50,open:false,ad:false,speed:1};
let customerTimer=null,customerId=0;
function el(id){return document.getElementById(id)}
function money(n){return '$'+Number(n||0).toFixed(2)}
function addLog(text){const d=document.createElement('div');d.textContent='• '+text;el('log').prepend(d)}
function save(){localStorage.setItem('cse-v21',JSON.stringify({state,products}))}
function load(){try{const raw=localStorage.getItem('cse-v21');if(!raw)return;const data=JSON.parse(raw);Object.assign(state,data.state||{});Object.keys(products).forEach(k=>{if(data.products&&data.products[k])Object.assign(products[k],data.products[k])});state.open=false}catch(err){console.error(err)}}
function render(){
 el('money').textContent=money(state.money); el('day').textContent='Day '+state.day; el('served').textContent=state.served; el('profit').textContent=money(state.profit); el('rep').textContent=state.rep;
 el('stockCount').textContent=Object.values(products).reduce((sum,p)=>sum+p.stock,0); el('openStoreBtn').textContent=state.open?'⏸ CLOSE STORE':'▶ OPEN STORE';
 const inv=el('inventory'); inv.innerHTML='';
 Object.entries(products).forEach(([name,p])=>{const row=document.createElement('div');row.className='row';row.innerHTML=`<div>${p.icon} <b>${name}</b><small>Sell ${money(p.sell)} • Cost ${money(p.cost)}</small></div><b>${p.stock}/${p.max}</b>`;const b=document.createElement('button');b.textContent='Restock';b.addEventListener('click',()=>restock(name));row.appendChild(b);inv.appendChild(row)});
 const up=el('upgrades');up.innerHTML='';
 [['📣','Local Advertising','More customers','ad',200,state.ad],['🛒','Bigger Shelves','+5 capacity each','shelf',300,false],['⚡','Fast Checkout','Customers move faster','speed',350,state.speed>1]].forEach(([icon,title,desc,type,cost,owned])=>{const row=document.createElement('div');row.className='upgrade';row.innerHTML=`<div>${icon} <b>${title}</b><small>${desc}</small></div>`;const b=document.createElement('button');b.textContent=owned?'Owned':money(cost);b.disabled=owned;b.addEventListener('click',()=>upgrade(type,cost));row.appendChild(b);up.appendChild(row)});
 save();
}
function restock(name){const p=products[name],qty=p.max-p.stock,cost=qty*p.cost;if(!qty)return addLog(name+' is already full.');if(state.money<cost)return addLog('Not enough cash to restock '+name+'.');state.money-=cost;state.profit-=cost;p.stock=p.max;addLog(`Restocked ${name} for ${money(cost)}.`);render()}
function upgrade(type,cost){if((type==='ad'&&state.ad)||(type==='speed'&&state.speed>1))return;if(state.money<cost)return addLog('Not enough cash for that upgrade.');state.money-=cost;state.profit-=cost;if(type==='ad')state.ad=true;if(type==='speed')state.speed=1.45;if(type==='shelf')Object.values(products).forEach(p=>p.max+=5);addLog('Upgrade purchased!');render();if(state.open)startCustomerLoop()}
function move(person,x,y,delay){setTimeout(()=>{person.style.left=x+'px';person.style.top=y+'px'},delay/state.speed)}
function spawnCustomer(){if(!state.open)return;const available=Object.entries(products).filter(([,p])=>p.stock>0);if(!available.length){addLog('Customer left: shelves are empty.');return}const [name,p]=available[Math.floor(Math.random()*available.length)];const store=el('store'),w=store.clientWidth,h=store.clientHeight;const person=document.createElement('div');person.className='person';person.textContent=['🧑','👩','👨','🧔','👵','👨‍🦱'][customerId++%6];person.style.left='25px';person.style.top=(h-70)+'px';el('people').appendChild(person);const mobile=w<650;const targets=mobile?{Soda:[90,80],Chips:[230,80],Candy:[90,220],Water:[230,220]}:{Soda:[150,90],Chips:[370,90],Candy:[150,240],Water:[370,240]};move(person,...targets[name],100);move(person,w-125,h-95,1300);setTimeout(()=>{if(p.stock>0&&state.open){p.stock--;state.money+=p.sell;state.profit+=p.sell;state.served++;state.rep=Math.min(100,state.rep+1);addLog(`${person.textContent} bought ${name} for ${money(p.sell)}.`);render()}},2200/state.speed);move(person,25,h-70,2600);setTimeout(()=>person.remove(),3600/state.speed)}
function startCustomerLoop(){clearInterval(customerTimer);spawnCustomer();customerTimer=setInterval(spawnCustomer,state.ad?1700:2600)}
function toggleStore(){state.open=!state.open;el('status').textContent=state.open?'Store OPEN — customers are shopping!':'Store closed. No new customers will enter.';if(state.open)startCustomerLoop();else clearInterval(customerTimer);render()}
function endDay(){state.open=false;clearInterval(customerTimer);const expense=35;state.money-=expense;state.profit-=expense;state.day++;addLog(`Day ended. Paid ${money(expense)} in rent/utilities.`);el('status').textContent='New day. Restock before opening.';render()}
window.addEventListener('DOMContentLoaded',()=>{load();el('openStoreBtn').addEventListener('click',toggleStore);el('endDayBtn').addEventListener('click',endDay);render();addLog('V2.1 ready — click OPEN STORE to start customers.')});
