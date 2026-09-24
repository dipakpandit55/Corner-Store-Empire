const baseProducts=[
 {id:'soda',name:'Soda',emoji:'🥤',cost:1.00,price:2.49,stock:6,cap:10},
 {id:'chips',name:'Chips',emoji:'🍟',cost:.80,price:1.99,stock:6,cap:10},
 {id:'candy',name:'Candy',emoji:'🍫',cost:.60,price:1.69,stock:6,cap:10},
 {id:'water',name:'Water',emoji:'💧',cost:.55,price:1.79,stock:6,cap:10}
];
let state=JSON.parse(localStorage.getItem('cse-save'))||{day:1,cash:500,profit:0,served:0,rep:50,products:baseProducts,upgrades:{cooler:false,coffee:false,ads:false},open:false};
if(!state.products?.length)state.products=baseProducts;
const $=id=>document.getElementById(id); const money=n=>Number(n).toFixed(2);
function save(){localStorage.setItem('cse-save',JSON.stringify(state))}
function render(){ $('cash').textContent=money(state.cash);$('day').textContent='Day '+state.day;$('profit').textContent=money(state.profit);$('customers').textContent=state.served;$('rep').textContent=state.rep;
 $('products').innerHTML=state.products.map(p=>`<div class='product'><div class='product-info'><b>${p.emoji} ${p.name}</b><small>Sell $${money(p.price)} • Cost $${money(p.cost)}</small></div><span class='stock'>${p.stock}/${p.cap}</span><button onclick="restock('${p.id}')">Restock</button></div>`).join('');
 $('shelves').innerHTML=state.products.slice(0,4).map(p=>`<div class='shelf'>${p.emoji}<small>${p.name} ${p.stock}/${p.cap}</small></div>`).join('');$('openBtn').textContent=state.open?'⏸ CLOSE STORE':'▶ OPEN STORE';save()}
function log(msg,type=''){let d=document.createElement('div');d.className='entry '+type;d.textContent=msg;$('log').prepend(d)}
window.restock=id=>{let p=state.products.find(x=>x.id===id),qty=p.cap-p.stock,cost=qty*p.cost;if(!qty)return log(p.name+' is already full.');if(state.cash<cost)return log('Not enough cash to restock.','bad');state.cash-=cost;state.profit-=cost;p.stock=p.cap;log(`📦 Restocked ${p.name}: -$${money(cost)}`);render()}
function customer(){if(!state.open)return;let available=state.products.filter(p=>p.stock>0);if(!available.length){state.rep=Math.max(0,state.rep-1);return log('😕 Customer left — shelves are empty.','bad')}let p=available[Math.floor(Math.random()*available.length)];p.stock--;state.cash+=p.price;state.profit+=p.price;state.served++;let c=document.createElement('div');c.className='customer';c.textContent=['🙂','😎','👩','👨','🧔'][Math.floor(Math.random()*5)];$('customerLane').appendChild(c);setTimeout(()=>c.style.left='72%',20);setTimeout(()=>c.remove(),1400);log(`${c.textContent} bought ${p.name} +$${money(p.price)}`,'good');render()}
let timer=null;$('openBtn').onclick=()=>{state.open=!state.open;if(state.open){log('🟢 Store opened!');timer=setInterval(customer,state.upgrades.ads?1300:1900)}else{clearInterval(timer);log('🔴 Store closed.')}render()};
$('nextBtn').onclick=()=>{state.open=false;clearInterval(timer);let rent=25;state.cash-=rent;state.profit-=rent;state.day++;if(Math.random()<.35){let loss=10+Math.floor(Math.random()*20);state.cash-=loss;state.profit-=loss;log(`🔧 Surprise expense: -$${loss}`,'bad')}else log('🌙 New day started. Daily overhead: -$25');render()};
window.buyUpgrade=type=>{let price={cooler:150,coffee:250,ads:300}[type];if(state.upgrades[type])return log('Upgrade already owned.');if(state.cash<price)return log('Not enough cash for that upgrade.','bad');state.cash-=price;state.profit-=price;state.upgrades[type]=true;if(type==='cooler')state.products.find(p=>p.id==='soda').cap+=2;if(type==='coffee')state.products.push({id:'coffee',name:'Coffee',emoji:'☕',cost:.45,price:2.79,stock:8,cap:8});log('✨ Upgrade purchased!','good');render()};render();log('Welcome, Boss. Your first store is ready!');
