const fs=require('fs');
const file='dist/world3d.js';let s=fs.readFileSync(file,'utf8');
const start=s.indexOf(' const player=new THREE.Group()'),end=s.indexOf(' const held=',start);
s=s.slice(0,start)+` const player=new THREE.Group();scene.add(player);
 const body=new THREE.Group();player.add(body);
 function limb(x,y,w,h,d,color){const pivot=new THREE.Group();pivot.position.set(x,y,0);body.add(pivot);box(0,-h/2,0,w,h,d,color,pivot);return pivot}
 const legs=[limb(-.38,1.2,.5,1.2,.6,'#2b4b61'),limb(.38,1.2,.5,1.2,.6,'#2b4b61')];
 const arms=[limb(-.85,2.25,.38,.85,.45,'#da8269'),limb(.85,2.25,.38,.85,.45,'#da8269')];
 arms.forEach(a=>ball(0,-.9,0,.28,'#285f6e',a));
 ball(0,1.65,0,.9,'#da8269',body).scale.set(.8,1,.65);ball(0,2.9,0,.64,'#ecc9a8',body);ball(0,3.28,0,.68,'#275e6b',body).scale.y=.65;ball(0,3.82,0,.22,'#fff1d4',body);box(0,2.46,.05,1.4,.25,1.2,'#f0d6a5',body);for(let side of [-1,1])ball(side*.23,2.94,.59,.065,'#283e47',body);
 let lastX=null,lastY=null,lastTime=null,stride=0,walkBlend=0;
 function animatePlayer(p,time,rolling){
  const dt=lastTime===null?0:Math.min(.05,Math.max(0,time-lastTime));
  const dx=lastX===null?0:p.x-lastX,dz=lastY===null?0:p.y-lastY;
  const distance=Math.hypot(dx,dz),walking=distance>.001;
  if(walking){const heading=Math.atan2(dx,dz);const delta=Math.atan2(Math.sin(heading-player.rotation.y),Math.cos(heading-player.rotation.y));player.rotation.y+=delta*(1-Math.exp(-dt*15));stride+=distance*.13;}
  walkBlend+=((walking?1:0)-walkBlend)*(1-Math.exp(-dt*16));
  const swing=Math.sin(stride)*.65*walkBlend;
  legs[0].rotation.x=swing;legs[1].rotation.x=-swing;
  arms[0].rotation.x=rolling&&walking?-.85*walkBlend:-swing*.8;
  arms[1].rotation.x=rolling&&walking?-.85*walkBlend:swing*.8;
  body.position.y=Math.abs(Math.sin(stride))*.12*walkBlend;
  body.rotation.x=(rolling?.12:.04)*walkBlend;
  player.position.set(wx(p.x),0,wz(p.y));lastX=p.x;lastY=p.y;lastTime=time;
 }
`+s.slice(end);
const a=s.indexOf('player.position.set(wx(p.x),0,wz(p.y));if(moving)'),b=s.indexOf('held.visible=',a);
if(a<0||b<0)throw Error('animation block missing');
s=s.slice(0,a)+'animatePlayer(p,time,rolling);'+s.slice(b);
s=s.replace('wx(p.x)+r+1.2,r+(carried.type', 'wx(p.x)+Math.sin(player.rotation.y)*(r+1.6),r+(carried.type');
s=s.replace("wz(p.y));if(rolling)heldBall.rotation.x=time*2", "wz(p.y)+Math.cos(player.rotation.y)*(r+1.6));if(rolling&&walkBlend>.1){heldBall.rotation.x=stride;heldBall.rotation.z=-Math.sin(player.rotation.y)*stride}");
fs.writeFileSync(file,s);
