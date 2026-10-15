const fs=require('fs');let s=fs.readFileSync('dist/world3d.js','utf8');
const start=s.indexOf('const flakesGeometry='),end=s.indexOf('\n const targetRing=',start);
s=s.slice(0,start)+`const flakeCount=1100,flakesGeometry=new THREE.BufferGeometry(),flakes=new Float32Array(flakeCount*3);
 const flakeCanvas=document.createElement('canvas');flakeCanvas.width=32;flakeCanvas.height=32;const flakeContext=flakeCanvas.getContext('2d');const glow=flakeContext.createRadialGradient(16,16,1,16,16,15);glow.addColorStop(0,'rgba(255,255,255,1)');glow.addColorStop(.5,'rgba(255,255,255,.85)');glow.addColorStop(1,'rgba(255,255,255,0)');flakeContext.fillStyle=glow;flakeContext.fillRect(0,0,32,32);
 for(let i=0;i<flakeCount;i++){flakes[i*3]=(Math.random()-.5)*120;flakes[i*3+1]=Math.random()*45;flakes[i*3+2]=(Math.random()-.5)*120}
 flakesGeometry.setAttribute('position',new THREE.BufferAttribute(flakes,3));const snowfall=new THREE.Points(flakesGeometry,new THREE.PointsMaterial({color:'#fff',size:.28,map:new THREE.CanvasTexture(flakeCanvas),transparent:true,opacity:.88,depthWrite:false}));snowfall.frustumCulled=false;scene.add(snowfall);let snowTime=null;
`+s.slice(end);
const a=s.indexOf('for(let i=0;i<450;i++){flakes[i*3+1]-='),b=s.indexOf('flakesGeometry.attributes.position.needsUpdate=true;',a);
if(a<0||b<0)throw Error('snow block missing');
s=s.slice(0,a)+`const snowDt=snowTime===null?0:Math.min(.05,time-snowTime);snowTime=time;for(let i=0;i<flakeCount;i++){flakes[i*3]+=(.55+Math.sin(time*.6+i)*.35)*snowDt;flakes[i*3+1]-=(1.7+i%7*.2)*snowDt;flakes[i*3+2]+=Math.cos(time*.4+i)*.25*snowDt;if(flakes[i*3+1]<0){flakes[i*3+1]=45;flakes[i*3]=wx(p.x)+(Math.random()-.5)*110;flakes[i*3+2]=wz(p.y)+(Math.random()-.5)*110}}`+s.slice(b);
fs.writeFileSync('dist/world3d.js',s);
let t=fs.readFileSync('test.cjs','utf8');t=t.replace("fs.readFileSync('dist/game.js','utf8')","fs.readFileSync('dist/game.js','utf8').replace(/import .*?; concluding/, '')");t=t.replace("/import .*?; concluding/","/import .*?;/");t=t.replace('Math,console});','Math,console,createWorld:()=>({render(){},resize(){},angle:()=>0})});');fs.writeFileSync('test.cjs',t);
