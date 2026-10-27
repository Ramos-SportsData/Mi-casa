/* Casa 3D para "Mi Casa" — plano de Segorbe (escala: barra de 3 m = 194 px). Piezas guardadas en localStorage (mc_3d). */
(function(){
var S=64.7,O=[330,692],H=2.5,T=.12,X=function(p){return(p-O[0])/S},Z=function(p){return(p-O[1])/S};
var R=[['Salón-comedor',378,195,598,545,0xc8a77a,'18,06'],['Entrada',267,545,440,668,0xd9d2c4],['Pasillo',375,668,440,912,0xd9d2c4],['Distribuidor',197,912,440,1000,0xd9d2c4],['Cocina',200,668,375,912,0xb9c8cf,'9,68'],['Baño 2',440,553,598,693,0xa9c4d6,'4,80'],['Baño 1',440,693,598,818,0xa9c4d6,'3,88'],['Dormitorio 1',440,818,598,1190,0xc9b8a0,'13,29'],['Dormitorio 2',290,1000,440,1190,0xc9b8a0,'7,76'],['Dormitorio 3',62,1000,290,1190,0xc9b8a0,'9,85']];
var OP=[['h',545,385,440,'d'],['v',267,570,630,'d'],['h',668,305,355,'d'],['v',440,622,662,'d'],['v',440,915,960,'d'],['h',818,505,550,'d'],['h',1000,230,275,'d'],['h',1000,300,345,'d'],['h',195,400,580,'w'],['v',200,790,880,'w'],['h',1190,115,185,'w'],['h',1190,320,400,'w'],['h',1190,470,555,'w']];
var P=[];try{P=JSON.parse(localStorage.getItem('mc_3d')||'[]')}catch(e){}
var ov,ren,sc,cam,pg,ray,walk=false,az=0,el=1,dist=17,yaw=Math.PI,pit=0,px=X(350),pz=Z(600),mv={},sel=null,ready=false,TX={},wm,gm;
function sv(){try{localStorage.setItem('mc_3d',JSON.stringify(P))}catch(e){}}
function it(id){return(window.items||[]).filter(function(i){return i.id===id})[0]}
function ttl(p){var i=it(p.id);return i?i.title:'(producto borrado)'}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function hue(s){var h=0;String(s).split('').forEach(function(c){h=(h*31+c.charCodeAt(0))%360});return new THREE.Color().setHSL(h/360,.45,.62)}
function box(ax,f,a,b,y0,y1,mat){var L=(b-a)/S;if(L<=.01||y1<=y0)return;var g=ax=='h'?new THREE.BoxGeometry(L,y1-y0,T):new THREE.BoxGeometry(T,y1-y0,L);var m=new THREE.Mesh(g,mat||wm);m.position.set(ax=='h'?X((a+b)/2):X(f),(y0+y1)/2,ax=='h'?Z(f):Z((a+b)/2));sc.add(m)}
function lab(t,x,y,z,par){var c=document.createElement('canvas');c.width=256;c.height=96;var g=c.getContext('2d');g.fillStyle='rgba(20,20,20,.72)';g.fillRect(0,0,256,96);g.fillStyle='#fff';g.font='bold 28px sans-serif';g.textAlign='center';t.split('\n').forEach(function(l,i){g.fillText(l,128,40+i*34)});var s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false}));s.scale.set(1.5,.56,1);s.position.set(x,y,z);(par||sc).add(s)}
function world(){
 wm=new THREE.MeshLambertMaterial({color:0xf3f0ea});gm=new THREE.MeshLambertMaterial({color:0x9cd0ee,transparent:true,opacity:.35});
 sc.add(new THREE.HemisphereLight(0xffffff,0x998877,.9));var dl=new THREE.DirectionalLight(0xffffff,.6);dl.position.set(5,10,6);sc.add(dl);
 var segs={};
 R.forEach(function(r){var f=new THREE.Mesh(new THREE.BoxGeometry((r[3]-r[1])/S,.02,(r[4]-r[2])/S),new THREE.MeshLambertMaterial({color:r[5]}));f.position.set(X((r[1]+r[3])/2),.01,Z((r[2]+r[4])/2));sc.add(f);
  if(r[6])lab(r[0]+'\n'+r[6]+' m²',X((r[1]+r[3])/2),2.2,Z((r[2]+r[4])/2));
  [['h',r[2],r[1],r[3]],['h',r[4],r[1],r[3]],['v',r[1],r[2],r[4]],['v',r[3],r[2],r[4]]].forEach(function(s){segs[s.join()]=s})});
 Object.keys(segs).forEach(function(k){var s=segs[k],ax=s[0],f=s[1],a=s[2],b=s[3];
  var ops=OP.filter(function(o){return o[0]==ax&&Math.abs(o[1]-f)<=6}).map(function(o){return[Math.max(o[2],a),Math.min(o[3],b),o[4]]}).filter(function(o){return o[1]>o[0]}).sort(function(p,q){return p[0]-q[0]});
  var c=a;ops.forEach(function(o){box(ax,f,c,o[0],0,H);if(o[2]=='d')box(ax,f,o[0],o[1],2.05,H);else{box(ax,f,o[0],o[1],0,1);box(ax,f,o[0],o[1],2.2,H);box(ax,f,o[0],o[1],1,2.2,gm)}c=o[1]});box(ax,f,c,b,0,H)});
 pg=new THREE.Group();sc.add(pg)}
function pieces(){
 while(pg.children.length)pg.remove(pg.children[0]);
 P.forEach(function(p,k){var i=it(p.id),m=new THREE.MeshLambertMaterial({color:hue(p.id)});
  var b=new THREE.Mesh(new THREE.BoxGeometry(p.w,p.h,p.d),m);b.position.set(p.x,p.h/2,p.z);b.rotation.y=p.r;b.userData.k=k;pg.add(b);
  if(k===sel)b.add(new THREE.LineSegments(new THREE.EdgesGeometry(b.geometry),new THREE.LineBasicMaterial({color:0xff8800})));
  if(i&&i.image){var u=i.image;if(TX[u]&&TX[u]!==1){m.map=TX[u];m.color.set(0xffffff)}else if(!TX[u]){TX[u]=1;new THREE.TextureLoader().setCrossOrigin('anonymous').load(u,function(t){TX[u]=t;pieces()},undefined,function(){})}}
  lab(ttl(p).slice(0,18),p.x,p.h+.3,p.z,pg)})}
function ui(){
 $('c3chips').innerHTML=P.map(function(p,k){return'<button data-s="'+k+'" class="'+(k===sel?'on':'')+'">'+esc(ttl(p).slice(0,16))+'</button>'}).join('');
 $('c3bot').innerHTML=walk?'<button data-k="l">◀</button><button data-k="f">▲</button><button data-k="b">▼</button><button data-k="r">▶</button>':(sel!=null&&P[sel]?'<button data-a="w">◀</button><button data-a="n">▲</button><button data-a="s">▼</button><button data-a="e">▶</button><button data-a="rot">⟳</button><button data-a="size">📐</button><button data-a="del">🗑</button>':'');
 $('c3h').textContent=walk?'Arrastra para mirar':(P.length?'Toca una pieza para moverla (N arriba)':'Pulsa 📍 en un producto para colocarlo')}
function size(){var w=ov.querySelector('#c3v');ren.setSize(w.clientWidth,w.clientHeight);cam.aspect=w.clientWidth/w.clientHeight;cam.updateProjectionMatrix()}
function init(){
 if(ready)return;ready=true;
 var st=document.createElement('style');st.textContent='#c3d{position:fixed;inset:0;z-index:40;background:var(--bg);display:none}#c3d.show{display:block}#c3d canvas{display:block;touch-action:none}.c3b{position:absolute;display:flex;gap:6px;left:10px;right:10px;align-items:center}.c3b button{background:var(--card);color:var(--tx);border:1px solid var(--ln);border-radius:12px;font-size:17px;padding:10px 13px;font-family:inherit;touch-action:none}#c3top{top:calc(env(safe-area-inset-top) + 8px)}#c3chips{top:calc(env(safe-area-inset-top) + 62px);overflow-x:auto}#c3chips button{white-space:nowrap;font-size:14px;padding:7px 10px}#c3chips .on{border-color:var(--ac);color:var(--ac);font-weight:700}#c3bot{bottom:calc(env(safe-area-inset-bottom) + 10px);justify-content:center;flex-wrap:wrap}';document.head.appendChild(st);
 ov=document.createElement('div');ov.id='c3d';
 ov.innerHTML='<div id="c3v" style="position:absolute;inset:0"></div><div class="c3b" id="c3top"><button data-a="x">✕</button><button data-a="mode" id="c3m">🚶 Caminar</button><span id="c3h" style="font-size:12px;color:var(--mut)"></span></div><div class="c3b" id="c3chips"></div><div class="c3b" id="c3bot"></div>';
 document.body.appendChild(ov);
 ren=new THREE.WebGLRenderer({antialias:true,alpha:true});ren.setPixelRatio(Math.min(devicePixelRatio,2));ov.querySelector('#c3v').appendChild(ren.domElement);
 sc=new THREE.Scene();cam=new THREE.PerspectiveCamera(60,1,.05,100);ray=new THREE.Raycaster();world();pieces();
 var cv=ren.domElement,ptr={},n=0,d0=null;
 cv.onpointerdown=function(e){cv.setPointerCapture(e.pointerId);ptr[e.pointerId]=[e.clientX,e.clientY,e.clientX,e.clientY];n++};
 cv.onpointerup=cv.onpointercancel=function(e){var p=ptr[e.pointerId];if(!p)return;delete ptr[e.pointerId];n--;
  if(!walk&&e.type=='pointerup'&&Math.hypot(e.clientX-p[2],e.clientY-p[3])<6){var r=cv.getBoundingClientRect();ray.setFromCamera({x:(e.clientX-r.left)/r.width*2-1,y:-((e.clientY-r.top)/r.height)*2+1},cam);
   var h=ray.intersectObjects(pg.children.filter(function(o){return o.isMesh}))[0];sel=h?h.object.userData.k:null;pieces();ui()}};
 cv.onpointermove=function(e){var p=ptr[e.pointerId];if(!p)return;
  if(n==2&&!walk){var o=null;for(var k in ptr)if(k!=e.pointerId)o=ptr[k];dist=clamp(dist*Math.hypot(p[0]-o[0],p[1]-o[1])/Math.hypot(e.clientX-o[0],e.clientY-o[1]),4,40)}
  else{var dx=e.clientX-p[0],dy=e.clientY-p[1];if(walk){yaw-=dx*.005;pit=clamp(pit-dy*.005,-1.2,1.2)}else{az-=dx*.007;el=clamp(el+dy*.007,.1,1.5)}}
  p[0]=e.clientX;p[1]=e.clientY};
 cv.onwheel=function(e){dist=clamp(dist*(1+e.deltaY*.001),4,40)};
 ov.addEventListener('pointerdown',function(e){var k=e.target.dataset&&e.target.dataset.k;if(k)mv[k]=1});
 ['pointerup','pointerleave','pointercancel'].forEach(function(t){ov.addEventListener(t,function(){mv={}},true)});
 ov.addEventListener('click',function(e){var t=e.target,s=t.dataset.s,a=t.dataset.a,p=P[sel];
  if(s!=null){sel=+s;pieces();ui();return}if(!a)return;
  if(a=='x'){ov.classList.remove('show');return}
  if(a=='mode'){walk=!walk;t.textContent=walk?'🔝 Vista aérea':'🚶 Caminar';ui();return}
  if(!p)return;var d={n:[0,-1],s:[0,1],w:[-1,0],e:[1,0]}[a];
  if(d){p.x+=d[0]*.1;p.z+=d[1]*.1}
  else if(a=='rot')p.r+=Math.PI/2;
  else if(a=='size'){var v=prompt('Ancho x fondo x alto (cm)',Math.round(p.w*100)+'x'+Math.round(p.d*100)+'x'+Math.round(p.h*100));var m=v&&v.match(/(\d+)\D+(\d+)\D+(\d+)/);if(m){p.w=m[1]/100;p.d=m[2]/100;p.h=m[3]/100}}
  else if(a=='del'){if(confirm('¿Quitar esta pieza de la casa?')){P.splice(sel,1);sel=null}}
  sv();pieces();ui()});
 onresize=function(){if(ready)size()};
 (function loop(){requestAnimationFrame(loop);if(!ov.classList.contains('show'))return;
  if(walk){var sp=.04,fx=-Math.sin(yaw),fz=-Math.cos(yaw),f=(mv.f||0)-(mv.b||0),s=(mv.r||0)-(mv.l||0);px+=(fx*f-fz*s)*sp;pz+=(fz*f+fx*s)*sp;cam.position.set(px,1.6,pz);cam.rotation.set(pit,yaw,0,'YXZ')}
  else{cam.position.set(dist*Math.cos(el)*Math.sin(az),dist*Math.sin(el),dist*Math.cos(el)*Math.cos(az));cam.lookAt(0,0,0)}
  ren.render(sc,cam)})()}
function open(){init();ov.classList.add('show');size();pieces();ui()}
function place(id){
 open();var i=it(id)||{},c=i.category||'',d=/sof/i.test(c)?'200x90x85':/cama|dorm|colch/i.test(c)?'150x200x45':/mesa|escrit/i.test(c)?'120x70x75':/armario/i.test(c)?'100x55x200':/silla/i.test(c)?'50x50x90':'100x60x80';
 var s=document.createElement('div');s.className='sheet show';s.style.zIndex=50;
 s.innerHTML='<div class="panel"><h2>Colocar en la casa</h2><div style="color:var(--mut);font-size:14px">'+esc((i.title||'').slice(0,70))+'</div><label>Estancia</label><select id="c3r">'+R.map(function(r,k){return'<option value="'+k+'">'+esc(r[0])+'</option>'}).join('')+'</select><label>Medidas ancho x fondo x alto (cm)</label><input id="c3d2" value="'+d+'"><div class="acts" style="margin-top:16px"><button class="btn sec" id="c3c">Cancelar</button><button class="btn" id="c3o">Colocar</button></div></div>';
 ov.appendChild(s);$('c3c').onclick=function(){s.remove()};
 $('c3o').onclick=function(){var m=$('c3d2').value.match(/(\d+)\D+(\d+)\D+(\d+)/);if(!m){toast('Escribe las medidas, p. ej. 200x90x85');return}
  var r=R[$('c3r').value];P.push({id:id,x:X((r[1]+r[3])/2),z:Z((r[2]+r[4])/2),r:0,w:m[1]/100,d:m[2]/100,h:m[3]/100});sel=P.length-1;sv();s.remove();walk=false;$('c3m').textContent='🚶 Caminar';pieces();ui()}}
window.Casa3D={open:open,place:place};
})();
