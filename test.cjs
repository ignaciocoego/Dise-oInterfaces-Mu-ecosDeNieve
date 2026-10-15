const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const nodes=new Map(),draw=new Proxy({},{get:()=>()=>{}});function node(id){if(!nodes.has(id))nodes.set(id,{textContent:'',innerHTML:'',style:{},classList:{add(){},remove(){},toggle(){}},clientWidth:390,clientHeight:780,addEventListener(){},getContext:()=>draw,showModal(){this.open=true},close(){this.open=false}});return nodes.get(id)}
const vendorEvents=[];
const context=vm.createContext({document:{getElementById:node,querySelector:()=>node('close'),querySelectorAll:()=>[]},window:{addEventListener(){}},localStorage:{getItem:()=>null,setItem(){}},devicePixelRatio:1,requestAnimationFrame(){},setTimeout(){},clearTimeout(){},performance:{now:()=>1000},Math,console,createWorld:()=>({render(){},resize(){},angle:()=>0,vendor:e=>vendorEvents.push(e)})});
vm.runInContext(fs.readFileSync(__dirname+'/dist/game.js','utf8').replace(/import .*?;/, ''),context);const run=s=>vm.runInContext(s,context);
let clock=0;const ticks=n=>{for(let i=0;i<n;i++)run(`tick(${(++clock)*40})`)};
run("$('modal').close();p={x:260,y:350};gather()");assert.equal(run('ball'),null);
run('p={x:900,y:490};gather()');assert.equal(run('ball'),null);
run('p={x:510,y:520};gather();roll();keys.right=true');ticks(50);assert(run('ball.size')>25);run('keys={};rolling=false;p={...plaza};ball.size=49;place()');assert.equal(run('state.parts.length'),0);
for(const size of [50,34,20])run(`ball={type:'compacta',size:${size}};place()`);assert.equal(run('state.men.length'),1);assert.equal(run('state.coins'),65);assert.equal(run('state.parts.length'),0);assert(run("state.achievements.includes('first')"));assert(run('blocked(plaza.x,plaza.y)'),'el muñeco terminado queda en la plaza');
run("p={x:1010,y:300};ball={type:'compacta',size:15};launch()");ticks(29);assert.equal(run("patches.filter(q=>q.type==='magica').length"),1);
run("p={x:1010,y:325};gather();pressure.start=1000;document.getElementById('press').onclick()");assert.equal(run('ball.type'),'magica');assert(run("state.achievements.includes('magic')"));
// Colisión: caminando hacia el sur por el hielo, el puesto del mercado frena al jugador.
run("ball=null;p={x:910,y:560};keys={down:true}");ticks(40);assert(run('p.y')<=601,'el puesto debería bloquear el paso');run('keys={}');
// Mercado: desde la plaza, Mercado (M) camina hasta el puesto esquivando el banco y abre la tienda.
run("p={x:650,y:770};shop()");assert.equal(run("$('modal').open"),false);for(let i=0;i<150&&!run("$('modal').open");i++)ticks(1);
assert.equal(run("$('modal').open"),true,'debería llegar al puesto y abrir la tienda');assert.match(run("$('modalBody').innerHTML"),/DOÑA NIEVES/);assert(vendorEvents.includes('open'));
run("buy('scarf')");assert.equal(run('state.coins'),50);assert(run("state.equipped.includes('scarf')&&state.men.at(-1).items.includes('scarf')"));assert(vendorEvents.includes('buy'));assert(run("state.achievements.includes('style')"));
run("buy('scarf')");assert(!run("state.equipped.includes('scarf')"));assert.equal(run('state.coins'),50);
console.log('PASS: powder/ice rejection, movement and rolling, minimum base size, 3-part completion, reward, magic tree drop, pressure success, achievements, market collision, walk-to-market with steering, buy/equip/unequip.');
