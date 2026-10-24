(function(){
var KEY='neostyle_cart', WA=document.body.dataset.wa || '';
var cur=document.body.dataset.cur || 'сом';
var catalog={}; try{catalog=JSON.parse(document.getElementById('catalog-data').textContent)}catch(e){}
var cart=[];
try{cart=JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){cart=[]}
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var fmt=function(n){return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' '+cur};
function save(){try{localStorage.setItem(KEY,JSON.stringify(cart))}catch(e){} render()}
function toast(t){var el=$('.toast');el.textContent=t;el.classList.add('show');
clearTimeout(toast.t);toast.t=setTimeout(function(){el.classList.remove('show')},1800)}
window.addToCart=function(id,opts){
var p=catalog[id]; if(!p) return;
cart.push({id:id,opt:opts||''}); save(); toast('Добавлено: '+p.name)};
function removeAt(i){cart.splice(i,1);save()}
function render(){
var c=$('#cart-count'); if(c) c.textContent=cart.length;
var list=$('#cart-list'), total=$('#cart-total'), wa=$('#cart-wa');
if(!list) return;
list.innerHTML=''; var sum=0, lines=[];
if(!cart.length) list.innerHTML='<p class="empty">Корзина пока пуста</p>';
cart.forEach(function(it,i){
var p=catalog[it.id]; if(!p) return; sum+=p.price;
lines.push((i+1)+'. '+p.name+(it.opt?' ('+it.opt+')':'')+' — '+fmt(p.price));
var d=document.createElement('div'); d.className='line';
d.innerHTML='<span>'+p.name+(it.opt?'<br><small>'+it.opt+'</small>':'')+'</span>'+
'<span>'+fmt(p.price)+' <button aria-label="Удалить">✕</button></span>';
d.querySelector('button').onclick=function(){removeAt(i)};
list.appendChild(d)});
total.textContent=fmt(sum);
var msg='Здравствуйте! Хочу заказать:\n'+lines.join('\n')+'\nИтого: '+fmt(sum);
wa.href='https://wa.me/'+WA+'?text='+encodeURIComponent(msg);
wa.style.display=cart.length?'inline-flex':'none'}
function drawer(open){$('.drawer').classList.toggle('open',open);$('.veil').classList.toggle('open',open)}
document.addEventListener('click',function(e){
var t=e.target.closest('[data-add]');
if(t){var opt=''; var box=t.closest('[data-product]');
if(box){var parts=[]; $$('.opts',box).forEach(function(g){
var on=$('.chip.on',g); if(on) parts.push(on.textContent)}); opt=parts.join(', ')}
addToCart(t.dataset.add,opt)}
if(e.target.closest('#open-cart')) drawer(true);
if(e.target.closest('.veil,#close-cart')) drawer(false);
var ch=e.target.closest('.opts .chip');
if(ch){$$('.chip',ch.parentNode).forEach(function(x){x.classList.remove('on')});ch.classList.add('on')}
if(e.target.closest('.burger')) $('.nav').classList.toggle('open');
if(e.target.closest('#theme')){
var d=document.documentElement; var n=d.dataset.theme==='dark'?'light':'dark';
d.dataset.theme=n; try{localStorage.setItem('neostyle_theme',n)}catch(err){}}});
var grid=$('#product-grid');
if(grid){
var state={cat:'all',q:''};
var apply=function(){var shown=0;
$$('.card',grid).forEach(function(c){
var ok=(state.cat==='all'||c.dataset.cat===state.cat)&&c.dataset.name.indexOf(state.q)>-1;
c.style.display=ok?'':'none'; if(ok) shown++});
$('#no-results').style.display=shown?'none':'block'};
$$('#filters .chip').forEach(function(b){b.onclick=function(){
$$('#filters .chip').forEach(function(x){x.classList.remove('on')});b.classList.add('on');
state.cat=b.dataset.cat;apply()}});
var s=$('#search'); if(s) s.oninput=function(){state.q=s.value.toLowerCase().trim();apply()};
var h=location.hash.replace('#','');
var pre=$('#filters .chip[data-cat="'+h+'"]'); if(pre) pre.click();
}
if('IntersectionObserver' in window){
var io=new IntersectionObserver(function(es){es.forEach(function(x){
if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.12});
$$('.reveal').forEach(function(el){io.observe(el)});
}else{$$('.reveal').forEach(function(el){el.classList.add('in')})}
try{var th=localStorage.getItem('neostyle_theme'); if(th) document.documentElement.dataset.theme=th}catch(e){}
render();
})();