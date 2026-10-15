// Arma Villa-Escarcha.html: un único archivo con todo adentro (CSS, three.js y el juego)
// que se abre con doble clic, sin servidor ni internet.  Uso:  node build-single.cjs
const fs=require('fs'),path=require('path');
const dist=path.join(__dirname,'dist'),read=f=>fs.readFileSync(path.join(dist,f),'utf8');

// three.js termina con un único `export{a as Nombre,...}`: lo convertimos en el objeto THREE.
let three=read('three.module.js');const exp=three.lastIndexOf('export{');
if(exp<0||three.indexOf('export',exp+1)>=0)throw Error('formato inesperado de three.module.js');
const names=three.slice(exp+7,three.lastIndexOf('}')).split(',').map(s=>{const [local,as]=s.trim().split(/\s+as\s+/);return (as||local)+':'+local});
three='const THREE=(()=>{'+three.slice(0,exp)+'\nreturn{'+names.join(',')+'}})();';

const world=read('world3d.js').replace("import * as THREE from './three.module.js';",'').replace('export function createWorld','function createWorld');
const game=read('game.js').replace("import {createWorld} from './world3d.js';",'');
if(/^\s*(import|export)\s/m.test(world+game))throw Error('quedó un import/export sin resolver');

let html=read('index.html');
const script=three+'\n'+world+'\n'+game;
if(/<\/script/i.test(script))throw Error('el código contiene </script>');
html=html.replace('<link rel="stylesheet" href="style.css">',()=>'<style>\n'+read('style.css')+'\n</style>')
 // Si algo falla al arrancar (por ejemplo, sin WebGL), el error se muestra en el panel de misión.
 .replace(/<script type="module">[\s\S]*?<\/script>/,()=>'<script>addEventListener("error",e=>{const o=document.getElementById("objective");if(o)o.textContent="No se pudo iniciar el juego: "+(e.message||e.error)})</script>\n<script type="module">\n'+script+'\n</script>');
if(html.includes('href="style.css"')||html.includes('import("./game.js")'))throw Error('no se pudo reemplazar index.html');
// Mismo archivo con dos nombres: para abrir con doble clic y para subir a GitHub Pages.
for(const out of [path.join(__dirname,'Villa-Escarcha.html'),path.join(__dirname,'github-pages','index.html')]){fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,html);console.log('Listo:',out,(fs.statSync(out).size/1024).toFixed(0)+' KB')}
